import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/mongoose';
import { User, QuizResult } from '@/lib/models';
import { interpretWellnessScore, QUESTIONNAIRES } from '@/lib/questionnaires';

// GET comprehensive wellness dashboard data
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
        hasCompletedAssessment: false,
        message: 'No comprehensive assessment found. Please complete the starter quiz.'
      });
    }

    // Build comprehensive dashboard data
    const dashboardData = {
      hasCompletedAssessment: true,
      assessmentDate: quizResult.createdAt,
      quizType: quizResult.quizType,
      
      // Overall wellness metrics
      wellnessScore: quizResult.wellnessScore || 0,
      interpretation: interpretWellnessScore(quizResult.wellnessScore || 0),
      
      // Domain breakdown
      domainScores: {},
      domainChart: [],
      
      // Risk flags and alerts
      flags: quizResult.flags || [],
      riskLevel: calculateRiskLevel(quizResult.flags || []),
      
      // Personalized insights
      insights: generateInsights(quizResult),
      
      // Recommendations
      recommendations: generateRecommendations(quizResult),
      
      // Progress tracking (if multiple assessments exist)
      progressData: await getProgressData(user._id),
      
      // Summary statistics
      summary: generateSummary(quizResult)
    };

    // Process domain results
    if (quizResult.domainResults && quizResult.domainResults.length > 0) {
      quizResult.domainResults.forEach(domain => {
        dashboardData.domainScores[domain.domain] = {
          score: domain.normalizedScore || 0,
          rawScore: domain.rawScore,
          severity: domain.severity,
          description: domain.description,
          questionnaire: domain.questionnaire
        };
        
        // Add to chart data
        dashboardData.domainChart.push({
          domain: domain.domain,
          score: domain.normalizedScore || 0,
          severity: domain.severity,
          color: getDomainColor(domain.domain)
        });
      });
    }

    return NextResponse.json(dashboardData);

  } catch (error) {
    console.error('Error fetching wellness dashboard:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper function to calculate overall risk level
function calculateRiskLevel(flags) {
  if (flags.length === 0) return 'low';
  
  const severityLevels = flags.map(flag => flag.severity.toLowerCase());
  
  if (severityLevels.some(s => s.includes('severe'))) return 'high';
  if (severityLevels.some(s => s.includes('moderate'))) return 'moderate';
  return 'mild';
}

// Helper function to generate personalized insights
function generateInsights(quizResult) {
  const insights = [];
  const wellnessScore = quizResult.wellnessScore || 0;
  const flags = quizResult.flags || [];
  const domains = quizResult.domainResults || [];

  // Overall wellness insight
  if (wellnessScore >= 80) {
    insights.push({
      type: 'positive',
      title: 'Strong Mental Wellness',
      message: 'Your overall mental wellness is excellent. Keep up the great work with your current coping strategies and self-care routines.',
      icon: '🌟'
    });
  } else if (wellnessScore >= 60) {
    insights.push({
      type: 'neutral',
      title: 'Good Mental Health Foundation',
      message: 'You have a solid foundation for mental wellness with some areas for improvement. Focus on the specific domains that need attention.',
      icon: '💪'
    });
  } else if (wellnessScore >= 40) {
    insights.push({
      type: 'warning',
      title: 'Mental Health Needs Attention',
      message: 'Your mental wellness could benefit from focused attention and support. Consider implementing targeted strategies for improvement.',
      icon: '⚠️'
    });
  } else {
    insights.push({
      type: 'alert',
      title: 'Significant Mental Health Concerns',
      message: 'Your assessment indicates significant mental health concerns. We strongly recommend seeking professional support.',
      icon: '🚨'
    });
  }

  // Domain-specific insights
  domains.forEach(domain => {
    const normalizedScore = domain.normalizedScore || 0;
    if (normalizedScore < 40) {
      insights.push({
        type: 'domain',
        title: `${domain.domain.charAt(0).toUpperCase() + domain.domain.slice(1)} Needs Focus`,
        message: `Your ${domain.domain} assessment shows ${domain.severity.toLowerCase()} levels. This area would benefit from targeted intervention.`,
        icon: getDomainIcon(domain.domain),
        domain: domain.domain
      });
    }
  });

  // Flag-based insights
  flags.forEach(flag => {
    insights.push({
      type: 'flag',
      title: flag.issue,
      message: `Your assessment indicates ${flag.severity.toLowerCase()} ${flag.issue.toLowerCase()}. Consider focusing on this area for improvement.`,
      icon: '🎯',
      domain: flag.domain
    });
  });

  return insights;
}

// Helper function to generate recommendations
function generateRecommendations(quizResult) {
  const recommendations = [];
  const flags = quizResult.flags || [];
  const domains = quizResult.domainResults || [];
  const wellnessScore = quizResult.wellnessScore || 0;

  // General recommendations based on wellness score
  if (wellnessScore < 40) {
    recommendations.push({
      priority: 'high',
      category: 'Professional Support',
      title: 'Seek Professional Help',
      description: 'Consider scheduling an appointment with a mental health professional for comprehensive evaluation and treatment planning.',
      actions: [
        'Contact a licensed therapist or counselor',
        'Speak with your primary care physician',
        'Consider our counseling services within the app',
        'Reach out to a mental health crisis line if needed'
      ]
    });
  }

  // Domain-specific recommendations
  const domainRecommendations = {
    depression: {
      category: 'Depression Support',
      title: 'Depression Management Strategies',
      description: 'Evidence-based approaches to manage depression symptoms and improve mood.',
      actions: [
        'Establish a daily routine with regular sleep and wake times',
        'Engage in regular physical activity (even light walking)',
        'Practice mindfulness or meditation',
        'Connect with supportive friends and family',
        'Consider cognitive behavioral therapy (CBT) techniques'
      ]
    },
    anxiety: {
      category: 'Anxiety Management',
      title: 'Anxiety Reduction Techniques',
      description: 'Proven methods to reduce anxiety and manage worry.',
      actions: [
        'Practice deep breathing exercises',
        'Try progressive muscle relaxation',
        'Limit caffeine and alcohol intake',
        'Use grounding techniques (5-4-3-2-1 method)',
        'Challenge negative thought patterns'
      ]
    },
    stress: {
      category: 'Stress Management',
      title: 'Stress Reduction Strategies',
      description: 'Effective ways to manage and reduce stress levels.',
      actions: [
        'Identify and address stress triggers',
        'Practice time management techniques',
        'Take regular breaks during work/study',
        'Engage in relaxing activities (reading, music, baths)',
        'Consider stress management workshops'
      ]
    },
    loneliness: {
      category: 'Social Connection',
      title: 'Building Social Connections',
      description: 'Ways to reduce loneliness and build meaningful relationships.',
      actions: [
        'Join clubs or groups with shared interests',
        'Volunteer for causes you care about',
        'Reach out to old friends or family members',
        'Consider group therapy or support groups',
        'Practice social skills in low-pressure environments'
      ]
    },
    adhd: {
      category: 'ADHD Management',
      title: 'ADHD Coping Strategies',
      description: 'Techniques to manage ADHD symptoms and improve focus.',
      actions: [
        'Use organizational tools (planners, apps, reminders)',
        'Break large tasks into smaller, manageable steps',
        'Create structured routines and environments',
        'Consider professional ADHD evaluation',
        'Explore medication options with a healthcare provider'
      ]
    },
    sadness: {
      category: 'Mood Enhancement',
      title: 'Improving Mood and Emotional Well-being',
      description: 'Strategies to lift mood and enhance emotional resilience.',
      actions: [
        'Engage in activities you previously enjoyed',
        'Practice gratitude journaling',
        'Spend time in nature or sunlight',
        'Listen to uplifting music',
        'Connect with supportive people'
      ]
    }
  };

  // Add domain-specific recommendations for flagged areas
  flags.forEach(flag => {
    const domainRec = domainRecommendations[flag.domain];
    if (domainRec && !recommendations.some(r => r.category === domainRec.category)) {
      recommendations.push({
        priority: flag.severity.toLowerCase().includes('severe') ? 'high' : 'medium',
        ...domainRec
      });
    }
  });

  // Add general wellness recommendations
  recommendations.push({
    priority: 'medium',
    category: 'General Wellness',
    title: 'Overall Mental Health Maintenance',
    description: 'Fundamental practices for maintaining good mental health.',
    actions: [
      'Maintain regular sleep schedule (7-9 hours)',
      'Eat a balanced, nutritious diet',
      'Exercise regularly (at least 30 minutes, 3x per week)',
      'Limit alcohol and avoid recreational drugs',
      'Practice regular self-care activities'
    ]
  });

  return recommendations;
}

// Helper function to get progress data
async function getProgressData(userId) {
  try {
    const results = await QuizResult.find({ 
      userId,
      wellnessScore: { $exists: true }
    }).sort({ createdAt: 1 }).limit(10);

    return results.map(result => ({
      date: result.createdAt,
      wellnessScore: result.wellnessScore,
      quizType: result.quizType
    }));
  } catch (error) {
    console.error('Error fetching progress data:', error);
    return [];
  }
}

// Helper function to generate summary
function generateSummary(quizResult) {
  const domains = quizResult.domainResults || [];
  const flags = quizResult.flags || [];
  
  const summary = {
    totalDomains: domains.length,
    flaggedDomains: flags.length,
    strongestDomain: null,
    weakestDomain: null,
    overallTrend: 'stable' // Could be enhanced with historical data
  };

  if (domains.length > 0) {
    // Find strongest and weakest domains
    const sortedDomains = domains.sort((a, b) => (b.normalizedScore || 0) - (a.normalizedScore || 0));
    summary.strongestDomain = {
      domain: sortedDomains[0].domain,
      score: sortedDomains[0].normalizedScore || 0
    };
    summary.weakestDomain = {
      domain: sortedDomains[sortedDomains.length - 1].domain,
      score: sortedDomains[sortedDomains.length - 1].normalizedScore || 0
    };
  }

  return summary;
}

// Helper function to get domain colors for charts
function getDomainColor(domain) {
  const colors = {
    depression: '#3B82F6', // Blue
    anxiety: '#EF4444',    // Red
    stress: '#F59E0B',     // Amber
    loneliness: '#8B5CF6', // Purple
    adhd: '#10B981',       // Emerald
    sadness: '#6366F1'     // Indigo
  };
  return colors[domain] || '#6B7280'; // Default gray
}

// Helper function to get domain icons
function getDomainIcon(domain) {
  const icons = {
    depression: '😔',
    anxiety: '😰',
    stress: '😤',
    loneliness: '😞',
    adhd: '🧠',
    sadness: '😢'
  };
  return icons[domain] || '🎯';
}
