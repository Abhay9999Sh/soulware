import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/mongoose';
import { User, QuizResult } from '@/lib/models';
import { interpretWellnessScore } from '@/lib/questionnaires';

// GET AI-powered insights and recommendations
export async function GET() {
  try {
    await dbConnect();
    const { userId: clerkId } = await auth();
    
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find the user in the database
    const user = await User.findOne({ clerkId });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Fetch user's most recent comprehensive quiz result
    const quizResult = await QuizResult.findOne({ 
      userId: user._id,
      $or: [
        { quizType: 'QUICK' },
        { quizType: 'FULL' },
        { wellnessScore: { $exists: true } }
      ]
    }).sort({ createdAt: -1 });

    if (!quizResult) {
      return NextResponse.json({ 
        hasData: false,
        message: 'No assessment data available for AI insights.'
      });
    }

    // Generate AI-powered insights
    const insights = await generateAIInsights(quizResult, user);

    return NextResponse.json({
      hasData: true,
      insights,
      generatedAt: new Date().toISOString(),
      assessmentDate: quizResult.createdAt
    });

  } catch (error) {
    console.error('Error generating AI insights:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// AI-powered insights generation
async function generateAIInsights(quizResult, user) {
  const { wellnessScore, domainResults, flags } = quizResult;
  const interpretation = interpretWellnessScore(wellnessScore || 0);

  // Analyze patterns and generate insights
  const insights = {
    // Overall wellness analysis
    overallAnalysis: generateOverallAnalysis(wellnessScore, interpretation, flags),
    
    // Domain-specific insights
    domainInsights: generateDomainInsights(domainResults || []),
    
    // Risk assessment
    riskAssessment: generateRiskAssessment(flags || [], wellnessScore),
    
    // Personalized recommendations
    recommendations: generatePersonalizedRecommendations(domainResults || [], flags || [], wellnessScore),
    
    // Coping strategies
    copingStrategies: generateCopingStrategies(domainResults || [], flags || []),
    
    // Progress tracking suggestions
    progressTracking: generateProgressTrackingSuggestions(wellnessScore, flags || []),
    
    // Professional support recommendations
    professionalSupport: generateProfessionalSupportRecommendations(wellnessScore, flags || [])
  };

  return insights;
}

function generateOverallAnalysis(wellnessScore, interpretation, flags) {
  const analysis = {
    score: wellnessScore,
    level: interpretation?.level || 'Unknown',
    description: interpretation?.description || '',
    keyFindings: [],
    strengths: [],
    areasForImprovement: []
  };

  // Key findings based on wellness score
  if (wellnessScore >= 80) {
    analysis.keyFindings.push("Your mental wellness is in excellent condition");
    analysis.strengths.push("Strong emotional resilience", "Effective coping mechanisms", "Good self-awareness");
  } else if (wellnessScore >= 60) {
    analysis.keyFindings.push("Your mental wellness shows a solid foundation with room for growth");
    analysis.strengths.push("Basic coping skills in place", "Awareness of mental health importance");
    analysis.areasForImprovement.push("Strengthening stress management", "Building emotional resilience");
  } else if (wellnessScore >= 40) {
    analysis.keyFindings.push("Your mental wellness needs focused attention and support");
    analysis.areasForImprovement.push("Developing healthy coping strategies", "Building support networks", "Stress management skills");
  } else {
    analysis.keyFindings.push("Your mental wellness requires immediate attention and professional support");
    analysis.areasForImprovement.push("Crisis management skills", "Professional therapeutic support", "Emergency coping strategies");
  }

  // Add flag-based findings
  if (flags.length > 0) {
    analysis.keyFindings.push(`${flags.length} specific areas identified for targeted intervention`);
  }

  return analysis;
}

function generateDomainInsights(domainResults) {
  return domainResults.map(domain => {
    const normalizedScore = domain.normalizedScore || 0;
    
    let insight = '';
    let actionItems = [];
    let severity = 'low';

    if (normalizedScore < 30) {
      severity = 'high';
      insight = `Your ${domain.domain} levels show significant concern and require immediate attention.`;
      actionItems = [
        `Seek professional help for ${domain.domain}`,
        `Implement daily coping strategies`,
        `Monitor symptoms closely`,
        `Build support network`
      ];
    } else if (normalizedScore < 50) {
      severity = 'moderate';
      insight = `Your ${domain.domain} levels are elevated and would benefit from targeted intervention.`;
      actionItems = [
        `Practice specific ${domain.domain} management techniques`,
        `Consider counseling or therapy`,
        `Develop healthy routines`,
        `Track progress regularly`
      ];
    } else if (normalizedScore < 70) {
      severity = 'mild';
      insight = `Your ${domain.domain} levels are manageable but could be improved with focused effort.`;
      actionItems = [
        `Implement preventive strategies`,
        `Build resilience skills`,
        `Maintain healthy habits`,
        `Stay aware of triggers`
      ];
    } else {
      severity = 'low';
      insight = `Your ${domain.domain} levels are well-managed. Continue current strategies.`;
      actionItems = [
        `Maintain current positive habits`,
        `Share strategies with others`,
        `Stay vigilant for changes`,
        `Continue self-care practices`
      ];
    }

    return {
      domain: domain.domain,
      score: normalizedScore,
      severity,
      insight,
      actionItems,
      questionnaire: domain.questionnaire
    };
  });
}

function generateRiskAssessment(flags, wellnessScore) {
  let riskLevel = 'low';
  let riskFactors = [];
  let protectiveFactors = [];
  let immediateActions = [];

  // Determine risk level
  if (wellnessScore < 30 || flags.some(f => f.severity.toLowerCase().includes('severe'))) {
    riskLevel = 'high';
    immediateActions.push(
      'Contact a mental health professional immediately',
      'Reach out to trusted friends or family',
      'Consider crisis hotline if needed',
      'Avoid being alone for extended periods'
    );
  } else if (wellnessScore < 50 || flags.some(f => f.severity.toLowerCase().includes('moderate'))) {
    riskLevel = 'moderate';
    immediateActions.push(
      'Schedule appointment with counselor',
      'Implement daily self-care routine',
      'Connect with support network',
      'Monitor symptoms closely'
    );
  } else {
    riskLevel = 'low';
    immediateActions.push(
      'Continue current wellness practices',
      'Stay connected with support system',
      'Maintain healthy lifestyle',
      'Regular self-assessment'
    );
  }

  // Identify risk factors from flags
  flags.forEach(flag => {
    riskFactors.push(`${flag.issue} (${flag.severity} level)`);
  });

  // Identify protective factors
  if (wellnessScore > 60) {
    protectiveFactors.push('Good overall mental wellness foundation');
  }
  if (flags.length === 0) {
    protectiveFactors.push('No major risk flags identified');
  }
  if (wellnessScore > 40) {
    protectiveFactors.push('Some coping mechanisms in place');
  }

  return {
    riskLevel,
    riskFactors,
    protectiveFactors,
    immediateActions,
    recommendation: riskLevel === 'high' ? 'Seek immediate professional help' :
                   riskLevel === 'moderate' ? 'Consider professional support' :
                   'Continue self-care and monitoring'
  };
}

function generatePersonalizedRecommendations(domainResults, flags, wellnessScore) {
  const recommendations = [];

  // General wellness recommendations
  if (wellnessScore < 60) {
    recommendations.push({
      category: 'Foundation Building',
      priority: 'high',
      title: 'Establish Mental Health Foundation',
      description: 'Build core mental wellness habits and routines',
      actions: [
        'Create a daily self-care routine',
        'Establish regular sleep schedule',
        'Practice mindfulness or meditation',
        'Engage in regular physical activity',
        'Maintain social connections'
      ],
      timeframe: '2-4 weeks'
    });
  }

  // Domain-specific recommendations
  const domainRecommendations = {
    depression: {
      category: 'Mood Enhancement',
      title: 'Depression Management',
      actions: [
        'Practice behavioral activation (scheduling pleasant activities)',
        'Challenge negative thought patterns',
        'Maintain social connections',
        'Consider light therapy if applicable',
        'Engage in regular exercise'
      ]
    },
    anxiety: {
      category: 'Anxiety Management',
      title: 'Anxiety Reduction',
      actions: [
        'Practice deep breathing exercises',
        'Use progressive muscle relaxation',
        'Try grounding techniques (5-4-3-2-1 method)',
        'Limit caffeine intake',
        'Practice exposure therapy for specific fears'
      ]
    },
    stress: {
      category: 'Stress Management',
      title: 'Stress Reduction',
      actions: [
        'Identify and address stress triggers',
        'Practice time management techniques',
        'Take regular breaks',
        'Use stress-reduction apps or tools',
        'Consider stress management workshops'
      ]
    },
    loneliness: {
      category: 'Social Connection',
      title: 'Building Relationships',
      actions: [
        'Join clubs or groups with shared interests',
        'Volunteer for meaningful causes',
        'Practice social skills in low-pressure settings',
        'Reach out to old friends',
        'Consider group therapy or support groups'
      ]
    },
    adhd: {
      category: 'Focus & Organization',
      title: 'ADHD Management',
      actions: [
        'Use organizational tools and apps',
        'Break tasks into smaller steps',
        'Create structured routines',
        'Minimize distractions in work environment',
        'Consider professional ADHD evaluation'
      ]
    }
  };

  // Add domain-specific recommendations
  flags.forEach(flag => {
    const domainRec = domainRecommendations[flag.domain];
    if (domainRec) {
      recommendations.push({
        ...domainRec,
        priority: flag.severity.toLowerCase().includes('severe') ? 'high' : 'medium',
        description: `Targeted strategies for managing ${flag.domain}`,
        timeframe: '4-8 weeks'
      });
    }
  });

  // Professional support recommendations
  if (wellnessScore < 40) {
    recommendations.push({
      category: 'Professional Support',
      priority: 'high',
      title: 'Seek Professional Help',
      description: 'Professional mental health support is recommended',
      actions: [
        'Schedule appointment with licensed therapist',
        'Consider psychiatric evaluation if needed',
        'Explore therapy options (CBT, DBT, etc.)',
        'Look into support groups',
        'Discuss medication options with healthcare provider'
      ],
      timeframe: 'Immediate'
    });
  }

  return recommendations;
}

function generateCopingStrategies(domainResults, flags) {
  const strategies = {
    immediate: [],
    daily: [],
    weekly: [],
    emergency: []
  };

  // Immediate coping strategies (use right now)
  strategies.immediate = [
    'Take 5 deep breaths (4 seconds in, 6 seconds out)',
    'Use the 5-4-3-2-1 grounding technique',
    'Step outside for fresh air',
    'Listen to calming music',
    'Call a trusted friend or family member'
  ];

  // Daily coping strategies
  strategies.daily = [
    'Practice 10 minutes of mindfulness or meditation',
    'Write in a gratitude journal',
    'Take a 20-minute walk',
    'Practice progressive muscle relaxation',
    'Engage in a hobby you enjoy'
  ];

  // Weekly coping strategies
  strategies.weekly = [
    'Schedule quality time with friends or family',
    'Engage in a creative activity',
    'Try a new relaxation technique',
    'Review and adjust your self-care routine',
    'Plan enjoyable activities for the upcoming week'
  ];

  // Emergency coping strategies
  strategies.emergency = [
    'Contact crisis hotline: 988 (Suicide & Crisis Lifeline)',
    'Go to nearest emergency room',
    'Call a trusted friend or family member immediately',
    'Use crisis text line: Text HOME to 741741',
    'Contact your mental health provider\'s emergency line'
  ];

  return strategies;
}

function generateProgressTrackingSuggestions(wellnessScore, flags) {
  return {
    frequency: wellnessScore < 40 ? 'daily' : wellnessScore < 70 ? 'weekly' : 'monthly',
    metrics: [
      'Mood rating (1-10 scale)',
      'Sleep quality and duration',
      'Energy levels',
      'Social interactions',
      'Stress levels',
      'Coping strategy usage'
    ],
    tools: [
      'Mood tracking apps',
      'Wellness journals',
      'Regular self-assessments',
      'Professional check-ins',
      'Goal setting and review'
    ],
    milestones: [
      'Complete 1 week of daily self-care',
      'Implement 3 new coping strategies',
      'Maintain consistent sleep schedule',
      'Engage in social activity weekly',
      'Practice mindfulness daily for 2 weeks'
    ]
  };
}

function generateProfessionalSupportRecommendations(wellnessScore, flags) {
  const recommendations = {
    urgency: 'low',
    types: [],
    when: '',
    resources: []
  };

  if (wellnessScore < 30) {
    recommendations.urgency = 'immediate';
    recommendations.when = 'Seek help immediately';
    recommendations.types = [
      'Crisis intervention',
      'Emergency mental health services',
      'Psychiatric evaluation',
      'Intensive therapy'
    ];
  } else if (wellnessScore < 50) {
    recommendations.urgency = 'high';
    recommendations.when = 'Seek help within 1-2 weeks';
    recommendations.types = [
      'Individual therapy',
      'Psychiatric consultation',
      'Support groups',
      'Counseling services'
    ];
  } else if (wellnessScore < 70) {
    recommendations.urgency = 'moderate';
    recommendations.when = 'Consider professional support';
    recommendations.types = [
      'Counseling or therapy',
      'Support groups',
      'Wellness coaching',
      'Preventive mental health services'
    ];
  } else {
    recommendations.urgency = 'low';
    recommendations.when = 'Maintain current wellness practices';
    recommendations.types = [
      'Wellness check-ins',
      'Preventive counseling',
      'Peer support groups',
      'Mental health maintenance'
    ];
  }

  recommendations.resources = [
    'Campus counseling center',
    'Community mental health centers',
    'Online therapy platforms',
    'Crisis hotlines and text lines',
    'Support groups (in-person and online)'
  ];

  return recommendations;
}
