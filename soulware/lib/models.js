const mongoose = require("mongoose");

//
// 1. User (all roles)
//
const userSchema = new mongoose.Schema({
  clerkId: { type: String, unique: true, required: true }, // from Clerk auth
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
delete mongoose.models.User;
const User = mongoose.model("User", userSchema);

//
// 2. Counselor Profile
//
const counselorProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
  qualification: String,
  languages: [String],
  bio: String,
  availability: [{ day: String, from: String, to: String }],
  isVerified: { type: Boolean, default: false }
});
delete mongoose.models.CounselorProfile;
const CounselorProfile = mongoose.model("CounselorProfile", counselorProfileSchema);

//
// 3. Volunteer Profile
//
const volunteerProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
  areas: [String], // e.g. "exam stress", "anxiety support"
  isApproved: { type: Boolean, default: false }
});
delete mongoose.models.VolunteerProfile;
const VolunteerProfile = mongoose.model("VolunteerProfile", volunteerProfileSchema);

//
// 4. Appointment (Booking system)
//
const appointmentSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  counselorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  scheduledFor: { type: Date, required: true },
  status: { type: String, enum: ["pending", "confirmed", "completed", "cancelled"], default: "pending" },
  notes: String,
  createdAt: { type: Date, default: Date.now }
});
delete mongoose.models.Appointment;
const Appointment = mongoose.model("Appointment", appointmentSchema);

//
// 5. Messages (chat, both bot & peer support)
//
const messageSchema = new mongoose.Schema({
  fromUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  toUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  text: String,
  type: { type: String, enum: ["bot", "peer", "counselor"], default: "peer" },
  createdAt: { type: Date, default: Date.now }
});
delete mongoose.models.Message;
const Message = mongoose.model("Message", messageSchema);

//
// 6. Bot Conversation (AI Chatbot sessions)
//
const botConversationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
  summary: String,
  createdAt: { type: Date, default: Date.now },
  lastInteractionAt: Date
});
delete mongoose.models.BotConversation;
const BotConversation = mongoose.model("BotConversation", botConversationSchema);

//
// 7. Library Article (Psychoeducational Hub)
//
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
delete mongoose.models.LibraryArticle;
const LibraryArticle = mongoose.model("LibraryArticle", libraryArticleSchema);

//
// 8. Peer Support Forum (Posts, Comments, Reports)
//
const peerPostSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: String,
  body: String,
  createdAt: { type: Date, default: Date.now },
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  tags: [String],
  isNominated: { type: Boolean, default: false },      // volunteer nominations
  isWeeklyHighlight: { type: Boolean, default: false } // admin highlight
});

peerPostSchema.add({
  flaggedByVolunteer: { type: Boolean, default: false },
  pushedToAdmin: { type: Boolean, default: false }
});

peerPostSchema.index({ createdAt: -1 });
delete mongoose.models.PeerPost;
const PeerPost = mongoose.model("PeerPost", peerPostSchema);

const peerCommentSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "PeerPost", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  body: String,
  createdAt: { type: Date, default: Date.now }
});
peerCommentSchema.index({ createdAt: -1 });
delete mongoose.models.PeerComment;
const PeerComment = mongoose.model("PeerComment", peerCommentSchema);

const peerReportSchema = new mongoose.Schema({
  targetType: { type: String, enum: ["post", "comment"], required: true },
  targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
  reporterId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  reason: String,
  createdAt: { type: Date, default: Date.now }
});
delete mongoose.models.PeerReport;
const PeerReport = mongoose.model("PeerReport", peerReportSchema);

//
// 9. Analytics Event (Admin Dashboard)
//
const analyticsEventSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  eventType: String,
  meta: Object,
  createdAt: { type: Date, default: Date.now }
});
delete mongoose.models.AnalyticsEvent;
const AnalyticsEvent = mongoose.model("AnalyticsEvent", analyticsEventSchema);

//
// 10. Audit Log (sensitive actions)
//
const auditLogSchema = new mongoose.Schema({
  actorUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  action: String,
  target: { collection: String, id: mongoose.Schema.Types.ObjectId },
  details: Object,
  createdAt: { type: Date, default: Date.now }
});
delete mongoose.models.AuditLog;
const AuditLog = mongoose.model("AuditLog", auditLogSchema);

//
// Exports
//
module.exports = {
  User,
  CounselorProfile,
  VolunteerProfile,
  Appointment,
  Message,
  BotConversation,
  LibraryArticle,
  PeerPost,
  PeerComment,
  PeerReport,
  AnalyticsEvent,
  AuditLog
};
