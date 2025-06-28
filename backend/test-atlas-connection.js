const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
    try {
        console.log('Attempting to connect to MongoDB Atlas...');
        console.log('Connection string:', process.env.MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@'));
        
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Successfully connected to MongoDB Atlas!');
        
        // Test creating a simple document
        const testSchema = new mongoose.Schema({ test: String });
        const TestModel = mongoose.model('Test', testSchema);
        
        const testDoc = new TestModel({ test: 'Atlas connection successful!' });
        await testDoc.save();
        console.log('✅ Successfully created test document!');
        
        // Clean up test document
        await TestModel.deleteOne({ _id: testDoc._id });
        console.log('✅ Test document cleaned up!');
        
        await mongoose.connection.close();
        console.log('✅ Connection closed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
        process.exit(1);
    }
}

testConnection();
