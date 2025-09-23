// Comprehensive Mental Health Questionnaires
// Based on validated clinical instruments: PHQ-9, GAD-7, DASS-21, UCLA-8, ASRS-6

export const QUESTIONNAIRES = {
  // PHQ-9 - Patient Health Questionnaire (Depression)
  PHQ9: {
    id: 'PHQ9',
    name: 'PHQ-9 Depression Assessment',
    description: 'Patient Health Questionnaire for Depression',
    timeframe: 'Over the last 2 weeks',
    responseScale: [
      { label: "Not at all", value: 0 },
      { label: "Several days", value: 1 },
      { label: "More than half the days", value: 2 },
      { label: "Nearly every day", value: 3 }
    ],
    questions: [
      "Little interest or pleasure in doing things",
      "Feeling down, depressed, or hopeless",
      "Trouble falling or staying asleep, or sleeping too much",
      "Feeling tired or having little energy",
      "Poor appetite or overeating",
      "Feeling bad about yourself — or that you are a failure or have let yourself or your family down",
      "Trouble concentrating on things, such as reading the newspaper or watching television",
      "Moving or speaking so slowly that other people could have noticed? Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual",
      "Thoughts that you would be better off dead or of hurting yourself in some way"
    ],
    scoring: {
      range: [0, 27],
      cutoffs: {
        0: { min: 0, max: 4, severity: "Minimal", description: "No depression" },
        1: { min: 5, max: 9, severity: "Mild", description: "Mild depression" },
        2: { min: 10, max: 14, severity: "Moderate", description: "Moderate depression" },
        3: { min: 15, max: 19, severity: "Moderately Severe", description: "Moderately severe depression" },
        4: { min: 20, max: 27, severity: "Severe", description: "Severe depression" }
      }
    },
    domain: 'depression'
  },

  // GAD-7 - Generalized Anxiety Disorder
  GAD7: {
    id: 'GAD7',
    name: 'GAD-7 Anxiety Assessment',
    description: 'Generalized Anxiety Disorder 7-item scale',
    timeframe: 'Over the last 2 weeks',
    responseScale: [
      { label: "Not at all", value: 0 },
      { label: "Several days", value: 1 },
      { label: "More than half the days", value: 2 },
      { label: "Nearly every day", value: 3 }
    ],
    questions: [
      "Feeling nervous, anxious, or on edge",
      "Not being able to stop or control worrying",
      "Worrying too much about different things",
      "Trouble relaxing",
      "Being so restless that it is hard to sit still",
      "Becoming easily annoyed or irritable",
      "Feeling afraid as if something awful might happen"
    ],
    scoring: {
      range: [0, 21],
      cutoffs: {
        0: { min: 0, max: 4, severity: "Minimal", description: "No anxiety" },
        1: { min: 5, max: 9, severity: "Mild", description: "Mild anxiety" },
        2: { min: 10, max: 14, severity: "Moderate", description: "Moderate anxiety" },
        3: { min: 15, max: 21, severity: "Severe", description: "Severe anxiety" }
      }
    },
    domain: 'anxiety'
  },

  // DASS-21 Stress Subscale (7 items)
  DASS_STRESS: {
    id: 'DASS_STRESS',
    name: 'DASS-21 Stress Assessment',
    description: 'Depression Anxiety Stress Scales - Stress Subscale',
    timeframe: 'Over the past week',
    responseScale: [
      { label: "Did not apply to me at all", value: 0 },
      { label: "Applied to me to some degree, or some of the time", value: 1 },
      { label: "Applied to me to a considerable degree or a good part of time", value: 2 },
      { label: "Applied to me very much or most of the time", value: 3 }
    ],
    questions: [
      "I found it hard to wind down",
      "I tended to over-react to situations",
      "I felt that I was using a lot of nervous energy",
      "I found myself getting agitated",
      "I found it difficult to relax",
      "I was intolerant of anything that kept me from getting on with what I was doing",
      "I felt that I was rather touchy"
    ],
    scoring: {
      range: [0, 42], // Raw score × 2 to match DASS-42 scale
      cutoffs: {
        0: { min: 0, max: 14, severity: "Normal", description: "Normal stress levels" },
        1: { min: 15, max: 18, severity: "Mild", description: "Mild stress" },
        2: { min: 19, max: 25, severity: "Moderate", description: "Moderate stress" },
        3: { min: 26, max: 33, severity: "Severe", description: "Severe stress" },
        4: { min: 34, max: 42, severity: "Extremely Severe", description: "Extremely severe stress" }
      }
    },
    domain: 'stress'
  },

  // UCLA Loneliness Scale - Short Form (8 items)
  UCLA8: {
    id: 'UCLA8',
    name: 'UCLA-8 Loneliness Scale',
    description: 'UCLA Loneliness Scale - Short Form',
    timeframe: 'Generally, how often do you feel',
    responseScale: [
      { label: "Never", value: 1 },
      { label: "Rarely", value: 2 },
      { label: "Sometimes", value: 3 },
      { label: "Often", value: 4 }
    ],
    questions: [
      "I lack companionship",
      "There is no one I can turn to",
      "I am an outgoing person", // Reverse scored
      "I feel left out",
      "I feel isolated from others",
      "I can find companionship when I want it", // Reverse scored
      "I am unhappy being so withdrawn",
      "People are around me but not with me"
    ],
    reverseScored: [2, 5], // 0-indexed positions of reverse-scored items
    scoring: {
      range: [8, 32],
      // Higher scores = more loneliness
      // Convert to 0-100 scale: (score - 8) / 24 * 100
      cutoffs: {
        0: { min: 8, max: 15, severity: "Low", description: "Low loneliness" },
        1: { min: 16, max: 20, severity: "Moderate", description: "Moderate loneliness" },
        2: { min: 21, max: 25, severity: "Moderately High", description: "Moderately high loneliness" },
        3: { min: 26, max: 32, severity: "High", description: "High loneliness" }
      }
    },
    domain: 'loneliness'
  },

  // PHQ-9 Item 2 (Sadness) - Used separately
  PHQ9_SADNESS: {
    id: 'PHQ9_SADNESS',
    name: 'Sadness Assessment',
    description: 'PHQ-9 Item 2 - Sadness Screening',
    timeframe: 'Over the last 2 weeks',
    responseScale: [
      { label: "Not at all", value: 0 },
      { label: "Several days", value: 1 },
      { label: "More than half the days", value: 2 },
      { label: "Nearly every day", value: 3 }
    ],
    questions: [
      "Feeling down, depressed, or hopeless"
    ],
    scoring: {
      range: [0, 3],
      cutoffs: {
        0: { min: 0, max: 0, severity: "None", description: "No sadness" },
        1: { min: 1, max: 1, severity: "Mild", description: "Mild sadness" },
        2: { min: 2, max: 2, severity: "Moderate", description: "Significant sadness" },
        3: { min: 3, max: 3, severity: "Severe", description: "Severe sadness" }
      }
    },
    domain: 'sadness'
  },

  // ASRS-6 - Adult ADHD Self-Report Scale (6-item screener)
  ASRS6: {
    id: 'ASRS6',
    name: 'ASRS-6 ADHD Screening',
    description: 'Adult ADHD Self-Report Scale - 6-item screener',
    timeframe: 'Over the past 6 months',
    responseScale: [
      { label: "Never", value: 0 },
      { label: "Rarely", value: 1 },
      { label: "Sometimes", value: 2 },
      { label: "Often", value: 3 },
      { label: "Very Often", value: 4 }
    ],
    questions: [
      "How often do you have trouble wrapping up the final details of a project, once the challenging parts have been done?",
      "How often do you have difficulty getting things in order when you have to do a task that requires organization?",
      "How often do you have problems remembering appointments or obligations?",
      "When you have a task that requires a lot of thought, how often do you avoid or delay getting started?",
      "How often do you fidget or squirm with your hands or feet when you have to sit down for a long time?",
      "How often do you feel overly active and compelled to do things, like you were driven by a motor?"
    ],
    scoring: {
      range: [0, 24],
      cutoffs: {
        0: { min: 0, max: 9, severity: "Low", description: "Low ADHD risk" },
        1: { min: 10, max: 13, severity: "Borderline", description: "Borderline ADHD risk" },
        2: { min: 14, max: 17, severity: "Mild", description: "Mild ADHD risk" },
        3: { min: 18, max: 24, severity: "High", description: "High ADHD risk" }
      }
    },
    domain: 'adhd'
  }
};

// Quiz configurations
export const QUIZ_TYPES = {
  QUICK: {
    id: 'QUICK',
    name: 'Quick Check',
    description: 'Fast depression + anxiety snapshot',
    duration: '≈5 minutes',
    questionnaires: ['PHQ9', 'GAD7'],
    totalQuestions: 16
  },
  FULL: {
    id: 'FULL',
    name: 'Full Assessment',
    description: 'Comprehensive mental health profile',
    duration: '≈15-20 minutes',
    questionnaires: ['PHQ9', 'GAD7', 'DASS_STRESS', 'UCLA8', 'PHQ9_SADNESS', 'ASRS6'],
    totalQuestions: 37
  }
};

// Scoring utilities
export const calculateDomainScore = (questionnaire, answers) => {
  const q = QUESTIONNAIRES[questionnaire];
  if (!q || !answers) return null;

  let rawScore = 0;
  
  // Handle reverse scoring for UCLA-8
  if (q.reverseScored) {
    answers.forEach((answer, index) => {
      if (q.reverseScored.includes(index)) {
        // Reverse score: for 1-4 scale, reverse is 5-answer
        const maxValue = Math.max(...q.responseScale.map(r => r.value));
        const minValue = Math.min(...q.responseScale.map(r => r.value));
        rawScore += (maxValue + minValue) - answer;
      } else {
        rawScore += answer;
      }
    });
  } else {
    rawScore = answers.reduce((sum, answer) => sum + (answer || 0), 0);
  }

  // Apply DASS-21 stress multiplier
  if (questionnaire === 'DASS_STRESS') {
    rawScore *= 2;
  }

  // Determine severity
  let severity = 'Unknown';
  let description = '';
  
  for (const [level, cutoff] of Object.entries(q.scoring.cutoffs)) {
    if (rawScore >= cutoff.min && rawScore <= cutoff.max) {
      severity = cutoff.severity;
      description = cutoff.description;
      break;
    }
  }

  return {
    questionnaire,
    domain: q.domain,
    rawScore,
    severity,
    description,
    range: q.scoring.range
  };
};

// Normalize scores to 0-100 (higher = better wellness)
export const normalizeScore = (domainResult) => {
  if (!domainResult) return 0;
  
  const { questionnaire, rawScore, range } = domainResult;
  const [min, max] = range;
  
  // For loneliness (UCLA-8), higher raw score = more loneliness, so invert
  if (questionnaire === 'UCLA8') {
    // Convert 8-32 range to 0-100 (higher = less lonely = better wellness)
    return Math.round(100 - ((rawScore - 8) / 24 * 100));
  }
  
  // For all others, higher raw score = worse condition, so invert
  return Math.round(100 - ((rawScore - min) / (max - min) * 100));
};

// Calculate overall wellness score
export const calculateWellnessScore = (domainResults) => {
  if (!domainResults || domainResults.length === 0) return 0;
  
  const normalizedScores = domainResults.map(normalizeScore);
  const average = normalizedScores.reduce((sum, score) => sum + score, 0) / normalizedScores.length;
  
  return Math.round(average);
};

// Flag high-risk domains
export const flagHighRiskDomains = (domainResults) => {
  const flags = [];
  
  domainResults.forEach(result => {
    const { questionnaire, rawScore, domain, severity } = result;
    
    switch (questionnaire) {
      case 'PHQ9':
        if (rawScore >= 10) flags.push({ domain, issue: 'Moderate/Severe Depression', severity });
        break;
      case 'GAD7':
        if (rawScore >= 10) flags.push({ domain, issue: 'Moderate/Severe Anxiety', severity });
        break;
      case 'DASS_STRESS':
        if (rawScore >= 19) flags.push({ domain, issue: 'High Stress', severity });
        break;
      case 'UCLA8':
        if (rawScore >= 21) flags.push({ domain, issue: 'High Loneliness', severity });
        break;
      case 'PHQ9_SADNESS':
        if (rawScore >= 2) flags.push({ domain, issue: 'Consistent Depressed Mood', severity });
        break;
      case 'ASRS6':
        if (rawScore >= 14) flags.push({ domain, issue: 'ADHD Likely', severity });
        break;
    }
  });
  
  return flags.slice(0, 3); // Return top 3 issues
};

// Wellness interpretation
export const interpretWellnessScore = (score) => {
  if (score >= 80) return { level: 'High Wellness', color: 'green', description: 'Excellent mental health' };
  if (score >= 60) return { level: 'Moderate Wellness', color: 'yellow', description: 'Good mental health with some areas for improvement' };
  if (score >= 40) return { level: 'Low Wellness', color: 'orange', description: 'Mental health concerns that may benefit from support' };
  return { level: 'Very Low Wellness', color: 'red', description: 'Significant mental health concerns requiring attention' };
};
