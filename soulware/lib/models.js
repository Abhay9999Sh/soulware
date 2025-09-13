// MongoDB Schemas using JS objects (for direct usage with MongoDB driver)

export const studentSchema = {
  userId: String, // Clerk user id
  name: String,
  email: String,
  enrollmentNo: String,
  year: Number,
  branch: String,
  languagePref: String,
  isAnonymous: Boolean,
  createdAt: Date,
};

export const counselorSchema = {
  userId: String,
  name: String,
  email: String,
  department: String,
  specialization: String,
  availableSlots: [Date],
  createdAt: Date,
};

export const volunteerSchema = {
  userId: String,
  name: String,
  email: String,
  role: String,
  trained: Boolean,
  assignedSections: [String],
  createdAt: Date,
};

export const adminSchema = {
  userId: String,
  name: String,
  email: String,
  designation: String,
  permissions: [String],
  createdAt: Date,
};

export const bookingSchema = {
  studentId: String, // reference to students collection
  counselorId: String, // reference to counselors collection
  mode: String, // "chat", "call", "in-person"
  slot: Date, // requested date-time
  isAnonymous: Boolean, // if true -> counselor sees "Anonymous Student"
  status: String, // "pending", "accepted", "rejected", "completed", "cancelled"
  chatId: String, // for chat sessions, reference to chats collection
  createdAt: Date,
  updatedAt: Date,
};

export const chatSchema = {
  bookingId: String, // reference to bookings collection
  participants: {
    student: String, // student userId
    counselor: String, // counselor userId
  },
  isActive: Boolean, // true when session is ongoing
  createdAt: Date,
  updatedAt: Date,
};

export const messageSchema = {
  chatId: String, // reference to chats collection
  senderId: String, // userId of sender
  senderRole: String, // "student" or "counselor"
  content: String, // message content
  timestamp: Date,
  isRead: Boolean,
};
