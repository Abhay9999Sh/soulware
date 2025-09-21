const mongoose = require('mongoose');
require('dotenv').config();

async function fixDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    
    // Drop the problematic index on conversations collection
    try {
      await db.collection('conversations').dropIndex('participants_1');
      console.log('✅ Dropped old participants index');
    } catch (error) {
      console.log('Index may not exist, continuing...');
    }

    // Drop any other problematic indexes
    try {
      await db.collection('conversations').dropIndex('student_1_counselor_1');
      console.log('✅ Dropped old student_counselor index');
    } catch (error) {
      console.log('Student_counselor index may not exist, continuing...');
    }

    console.log('✅ Database indexes fixed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing database:', error);
    process.exit(1);
  }
}

fixDatabase();
