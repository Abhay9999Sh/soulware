// Enhanced MongoDB Schemas for Mental Health Application

// User Progress Tracking Schema
export const userProgressSchema = {
  userId: String, // Clerk user id
  currentScore: Number, // Current PHQ-9 score (0-27)
  wellnessLevel: String, // "minimal", "mild", "moderate", "moderately-severe", "severe"
  weeklyScores: [{ 
    date: Date, 
    score: Number,
    quizType: String // "starter", "weekly", "custom"
  }],
  completedQuizzes: [{
    quizId: String,
    date: Date,
    type: String, // "phq9", "gad7", "custom"
    score: Number,
    responses: [Number], // Array of individual question responses
    recommendations: [String]
  }],
  achievements: [{
    id: String,
    title: String,
    description: String,
    unlockedAt: Date,
    category: String // "streak", "engagement", "progress", "community"
  }],
  weeklyActivities: {
    moodChecks: Number,
    articlesRead: [{
      articleId: String,
      title: String,
      category: String,
      readAt: Date,
      timeSpent: Number // in minutes
    }],
    communityPosts: Number,
    sessionsAttended: Number,
    chatMessages: Number,
    quizzesCompleted: Number
  },
  streaks: {
    currentMoodCheckStreak: Number,
    longestMoodCheckStreak: Number,
    currentEngagementStreak: Number,
    longestEngagementStreak: Number
  },
  preferences: {
    reminderFrequency: String, // "daily", "weekly", "biweekly"
    preferredTopics: [String],
    anonymousMode: Boolean,
    notificationsEnabled: Boolean
  },
  createdAt: Date,
  updatedAt: Date
};

// Quiz System Schema
export const quizSchema = {
  quizId: String,
  title: String,
  description: String,
  type: String, // "phq9", "gad7", "stress", "custom"
  category: String, // "depression", "anxiety", "stress", "general"
  questions: [{
    id: String,
    text: String,
    type: String, // "scale", "multiple-choice", "yes-no"
    options: [String], // For multiple choice
    scaleMin: Number,
    scaleMax: Number,
    scaleLabels: [String], // Labels for scale points
    weight: Number // For scoring calculation
  }],
  scoringRules: {
    minScore: Number,
    maxScore: Number,
    ranges: [{
      min: Number,
      max: Number,
      level: String, // "minimal", "mild", "moderate", etc.
      description: String,
      recommendations: [String]
    }]
  },
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
};

// Anonymous Chat Messages Schema
export const chatMessageSchema = {
  messageId: String,
  content: String,
  timestamp: Date,
  isAnonymous: Boolean,
  userId: String, // Hashed or anonymous ID
  messageType: String, // "text", "problem", "support"
  category: String, // "academic", "social", "mental-health", "campus", "relationships"
  upvotes: Number,
  downvotes: Number,
  votedBy: [String], // Array of anonymous user IDs who voted
  replies: [{
    replyId: String,
    content: String,
    timestamp: Date,
    userId: String,
    upvotes: Number
  }],
  isEscalated: Boolean,
  escalatedAt: Date,
  moderationStatus: String, // "pending", "approved", "flagged", "removed"
  tags: [String],
  isDaily: Boolean, // If this is the daily escalated problem
  adminNotified: Boolean
};

// Counseling Session Feedback Schema
export const sessionFeedbackSchema = {
  sessionId: String,
  counselorId: String,
  studentId: String, // Anonymous hash
  sessionDate: Date,
  sessionDuration: Number, // in minutes
  rating: Number, // 1-5 stars
  feedback: String,
  categories: [{
    category: String, // "communication", "helpfulness", "professionalism", "empathy"
    rating: Number
  }],
  wouldRecommend: Boolean,
  followUpNeeded: Boolean,
  reportedIssues: [String],
  isAnonymous: Boolean,
  timestamp: Date
};

// Counselor Performance Schema
export const counselorPerformanceSchema = {
  counselorId: String,
  totalSessions: Number,
  averageRating: Number,
  totalFeedbacks: Number,
  ratingDistribution: {
    fiveStars: Number,
    fourStars: Number,
    threeStars: Number,
    twoStars: Number,
    oneStar: Number
  },
  categoryRatings: [{
    category: String,
    averageRating: Number,
    totalRatings: Number
  }],
  negativeReports: Number,
  flaggedSessions: [String],
  adminAlerts: [{
    alertType: String, // "low-rating", "multiple-complaints", "flagged-behavior"
    date: Date,
    description: String,
    resolved: Boolean
  }],
  isActive: Boolean,
  lastReviewDate: Date,
  createdAt: Date,
  updatedAt: Date
};

// Daily Problem Escalation Schema
export const dailyProblemSchema = {
  problemId: String,
  date: Date,
  problem: String,
  category: String,
  totalUpvotes: Number,
  uniqueVoters: Number,
  originalMessageId: String,
  escalatedToAdmin: Boolean,
  adminResponse: String,
  adminResponseDate: Date,
  status: String, // "escalated", "in-review", "resolved", "dismissed"
  relatedMessages: [String], // Related message IDs
  actionsTaken: [String],
  studentsSupportingCount: Number
};

// Notification Schema
export const notificationSchema = {
  notificationId: String,
  userId: String,
  type: String, // "quiz-reminder", "achievement", "session-reminder", "community-update"
  title: String,
  message: String,
  isRead: Boolean,
  actionUrl: String, // URL to navigate when clicked
  priority: String, // "low", "medium", "high", "urgent"
  scheduledFor: Date,
  sentAt: Date,
  expiresAt: Date,
  metadata: Object, // Additional data specific to notification type
  createdAt: Date
};

// AI Chatbot Conversation Schema
export const chatbotConversationSchema = {
  conversationId: String,
  userId: String,
  isAnonymous: Boolean,
  messages: [{
    messageId: String,
    sender: String, // "user" or "bot"
    content: String,
    timestamp: Date,
    messageType: String, // "text", "quick-reply", "suggestion"
    metadata: Object // For storing additional context
  }],
  context: {
    userMood: String,
    topicCategory: String,
    urgencyLevel: String,
    suggestedResources: [String],
    escalationNeeded: Boolean
  },
  sessionDuration: Number, // in minutes
  satisfaction: Number, // 1-5 rating if provided
  startedAt: Date,
  endedAt: Date,
  isActive: Boolean
};

// Resource Engagement Schema
export const resourceEngagementSchema = {
  userId: String,
  resourceId: String,
  resourceType: String, // "article", "video", "exercise", "tool"
  resourceTitle: String,
  category: String,
  engagementType: String, // "viewed", "completed", "bookmarked", "shared"
  timeSpent: Number, // in minutes
  completionPercentage: Number,
  rating: Number, // 1-5 if rated
  notes: String, // User's personal notes
  bookmarked: Boolean,
  shared: Boolean,
  timestamp: Date,
  deviceType: String, // "mobile", "desktop", "tablet"
  referralSource: String // How they found this resource
};

// Weekly Report Schema
export const weeklyReportSchema = {
  userId: String,
  weekStartDate: Date,
  weekEndDate: Date,
  progressScore: Number, // Overall wellness progress
  activitiesSummary: {
    quizzesCompleted: Number,
    articlesRead: Number,
    sessionsAttended: Number,
    communityEngagement: Number,
    moodChecks: Number
  },
  achievements: [String], // Achievement IDs unlocked this week
  recommendations: [String],
  nextWeekGoals: [String],
  moodTrend: String, // "improving", "stable", "declining"
  generatedAt: Date,
  emailSent: Boolean,
  emailSentAt: Date
};
