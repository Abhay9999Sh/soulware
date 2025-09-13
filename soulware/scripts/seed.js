const mongoose = require('mongoose');
const { clerkClient } = require('@clerk/clerk-sdk-node');
require('dotenv').config();

// Import your Mongoose models
const { User, CounselorProfile, VolunteerProfile } = require('../lib/models'); // Adjust path if needed

// --- Configuration ---
const MONGO_URI = process.env.MONGODB_URI;
const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;
const TEST_PASSWORD = "SoulwareSeed@2025"; 

const usersToSeed = [
    {
        email: "counselor@test.com",
        firstName: "Emily",
        lastName: "Carter",
        role: "counselor",
        profile: { nickname: "Dr. Carter", displayName: "Dr. Emily Carter" },
        counselorProfile: { qualification: "PhD in Clinical Psychology", languages: ["English", "Hindi"], bio: "Specializing in CBT.", isVerified: true }
    },
    {
        email: "volunteer@test.com",
        firstName: "John",
        lastName: "Doe",
        role: "volunteer",
        profile: { nickname: "Johnny", displayName: "John D." },
        volunteerProfile: { areas: ["exam stress", "anxiety support"], isApproved: true }
    },
    {
        email: "admin@test.com",
        firstName: "Admin",
        lastName: "User",
        role: "admin",
        profile: { nickname: "Admin", displayName: "System Admin" }
    }
];

async function seedDatabase() {
  if (!MONGO_URI || !CLERK_SECRET_KEY) {
    console.error("Error: MONGODB_URI or CLERK_SECRET_KEY is not defined in .env.local");
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB using Mongoose.");

    for (const userData of usersToSeed) {
      console.log(`\nProcessing user: ${userData.email}`);

      // --- Step 1: Cleanup existing users ---
      const clerkUsers = await clerkClient.users.getUserList({ emailAddress: [userData.email] });
      if (clerkUsers.length > 0) {
        await clerkClient.users.deleteUser(clerkUsers[0].id);
        console.log(`- Deleted existing user from Clerk.`);
      }

      const existingDbUser = await User.findOne({ email: userData.email });
      if (existingDbUser) {
        if (existingDbUser.role === 'counselor') await CounselorProfile.deleteOne({ userId: existingDbUser._id });
        if (existingDbUser.role === 'volunteer') await VolunteerProfile.deleteOne({ userId: existingDbUser._id });
        await User.deleteOne({ email: userData.email });
        console.log(`- Deleted existing user from MongoDB.`);
      }

      // --- Step 2: Create user in Clerk ---
      const clerkUser = await clerkClient.users.createUser({
        emailAddress: [userData.email],
        password: TEST_PASSWORD,
        firstName: userData.firstName,
        lastName: userData.lastName,
      });
      console.log(`- Created user in Clerk with ID: ${clerkUser.id}`);

      // --- Step 3: Create user in MongoDB using Mongoose ---
      const newUser = new User({
        clerkId: clerkUser.id,
        email: userData.email,
        role: userData.role,
        profile: userData.profile,
        status: 'active'
      });
      await newUser.save();
      console.log(`- Created user in MongoDB 'users' collection.`);
      
      // --- Step 4: Create role-specific profiles ---
      if (userData.role === 'counselor' && userData.counselorProfile) {
        const newCounselorProfile = new CounselorProfile({
          userId: newUser._id,
          ...userData.counselorProfile
        });
        await newCounselorProfile.save();
        console.log(`- Created counselor profile.`);
      }
      if (userData.role === 'volunteer' && userData.volunteerProfile) {
        const newVolunteerProfile = new VolunteerProfile({
          userId: newUser._id,
          ...userData.volunteerProfile
        });
        await newVolunteerProfile.save();
        console.log(`- Created volunteer profile.`);
      }
      
      console.log(`✅ Successfully seeded user: ${userData.email}`);
    }

  } catch (error) {
    console.error("\n❌ An error occurred during seeding:", error);
  } finally {
    await mongoose.disconnect();
    console.log("\nDisconnected from MongoDB.");
  }
}

seedDatabase();