// Simple script to clear all chat data
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/soulware', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const conversationSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  title: String,
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const messageSchema = new mongoose.Schema({
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
}, { timestamps: true });

const Conversation = mongoose.model('Conversation', conversationSchema);
const Message = mongoose.model('Message', messageSchema);

async function clearChatData() {
  try {
    console.log('🗑️ Clearing all chat data...');
    
    const messageCount = await Message.countDocuments();
    const conversationCount = await Conversation.countDocuments();
    
    console.log(`Found ${conversationCount} conversations and ${messageCount} messages`);
    
    // Delete all messages first
    await Message.deleteMany({});
    console.log('✅ Deleted all messages');
    
    // Delete all conversations
    await Conversation.deleteMany({});
    console.log('✅ Deleted all conversations');
    
    console.log('🎉 Chat data cleared successfully!');
    
  } catch (error) {
    console.error('❌ Error clearing chat data:', error);
  } finally {
    mongoose.connection.close();
  }
}

clearChatData();
