import mongoose from 'mongoose';

// --- 1. User (all roles) ---
const userSchema = new mongoose.Schema({
  clerkId: { type: String, unique: true, required: true },
  email: { type: String, required: true },
  role: { type: String, enum: ["student", "volunteer", "counselor", "admin"], required: true },
  createdAt: { type: Date, default: Date.now },
  lastLoginAt: Date,
  status: { type: String, enum: ["active", "suspended"], default: "active" },
  profile: {
    nickname: String,
    avatarUrl: String,
    displayName: String
  },
  metadata: {
    collegeId: String,
    course: String,
    year: String
  }
});
export const User = mongoose.models.User || mongoose.model("User", userSchema);

// --- 2. Counselor Profile ---
const counselorProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true, required: true },
  qualification: String,
  languages: [String],
  bio: String,
  availability: [{ day: String, from: String, to: String }],
  isVerified: { type: Boolean, default: false }
});
export const CounselorProfile = mongoose.models.CounselorProfile || mongoose.model("CounselorProfile", counselorProfileSchema);

// --- 3. Volunteer Profile ---
const volunteerProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
  areas: [String],
  isApproved: { type: Boolean, default: false }
});
export const VolunteerProfile = mongoose.models.VolunteerProfile || mongoose.model("VolunteerProfile", volunteerProfileSchema);

// --- 4. Appointment (Booking system) - CORRECTED ---
const appointmentSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  counselorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  scheduledFor: { type: Date, required: true },
  mode: { 
    type: String, 
    enum: ["chat", "offline"], 
    required: true 
  },
  status: { 
    type: String, 
    enum: ["pending", "confirmed", "rejected", "completed", "cancelled"], 
    default: "pending" 
  },
  notes: String,
}, { timestamps: true });
export const Appointment = mongoose.models.Appointment || mongoose.model("Appointment", appointmentSchema);

// --- 5. Messages (chat) - CORRECTED ---
const messageSchema = new mongoose.Schema({
  conversationId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Conversation", 
    required: true, 
    index: true 
  }, 
  senderId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  text: String,
}, { timestamps: true });

export const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);

// --- 6. Bot Conversation ---
const botConversationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
  summary: String,
  createdAt: { type: Date, default: Date.now },
  lastInteractionAt: Date
});
export const BotConversation = mongoose.models.BotConversation || mongoose.model("BotConversation", botConversationSchema);

// --- 7. Library Article ---
const libraryArticleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true },
  category: String,
  language: { type: String, default: "en" },
  contentMarkdown: String,
  resourceType: { type: String, enum: ["video", "audio", "guide"], default: "guide" },
  tags: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
  published: { type: Boolean, default: false }
});
export const LibraryArticle = mongoose.models.LibraryArticle || mongoose.model("LibraryArticle", libraryArticleSchema);

// --- Quiz Result ---
const quizResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  quizType: { type: String, required: true, default: 'PHQ-9' },
  score: { type: Number, required: true },
  severity: { type: String, required: true },
  answers: [{
    question: String,
    answer: Number
  }],
  createdAt: { type: Date, default: Date.now }
});
export const QuizResult = mongoose.models.QuizResult || mongoose.model("QuizResult", quizResultSchema);

// --- 8. Peer Support Forum ---
const peerPostSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: String,
  body: String,
  createdAt: { type: Date, default: Date.now },
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  tags: [String],
  isNominated: { type: Boolean, default: false },
  isWeeklyHighlight: { type: Boolean, default: false },
  flaggedByVolunteer: { type: Boolean, default: false },
  pushedToAdmin: { type: Boolean, default: false }
});
peerPostSchema.index({ createdAt: -1 });
export const PeerPost = mongoose.models.PeerPost || mongoose.model("PeerPost", peerPostSchema);

const peerCommentSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "PeerPost", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  body: String,
  createdAt: { type: Date, default: Date.now }
});
peerCommentSchema.index({ createdAt: -1 });
export const PeerComment = mongoose.models.PeerComment || mongoose.model("PeerComment", peerCommentSchema);

const peerReportSchema = new mongoose.Schema({
  targetType: { type: String, enum: ["post", "comment"], required: true },
  targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
  reporterId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  reason: String,
  createdAt: { type: Date, default: Date.now }
});
export const PeerReport = mongoose.models.PeerReport || mongoose.model("PeerReport", peerReportSchema);

// --- 9. Analytics Event ---
const analyticsEventSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  eventType: String,
  meta: Object,
  createdAt: { type: Date, default: Date.now }
});
export const AnalyticsEvent = mongoose.models.AnalyticsEvent || mongoose.model("AnalyticsEvent", analyticsEventSchema);

// --- 10. Audit Log ---
const auditLogSchema = new mongoose.Schema({
  actorUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  action: String,
  target: { collection: String, id: mongoose.Schema.Types.ObjectId },
  details: Object,
  createdAt: { type: Date, default: Date.now }
});
export const AuditLog = mongoose.models.AuditLog || mongoose.model("AuditLog", auditLogSchema);

const conversationSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
}, { timestamps: true });

// Ensure that any pair of participants is unique to prevent duplicate conversations
conversationSchema.index({ participants: 1 }, { unique: true });

export const Conversation = mongoose.models.Conversation || mongoose.model('Conversation', conversationSchema);

// NOTE: The conflicting "module.exports" block at the end has been removed.