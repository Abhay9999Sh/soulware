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
