// Test script for Feedback API endpoints
const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Test data
const testFeedback = {
  doctorMedicalId: 'DOC001',
  patientMedicalId: 'PAT001', 
  rating: 5,
  comment: 'Excellent doctor! Very professional and caring.',
  isAnonymous: false
};

const testFeedback2 = {
  doctorMedicalId: 'DOC001',
  patientMedicalId: 'PAT002',
  rating: 4,
  comment: 'Good experience overall. Recommended!',
  isAnonymous: true
};

async function testFeedbackAPI() {
  console.log('🧪 Testing Feedback API endpoints...\n');

  try {
    // Test 1: Create feedback
    console.log('1. Testing CREATE feedback...');
    const createResponse1 = await axios.post(`${BASE_URL}/feedback`, testFeedback);
    console.log('✅ Feedback 1 created:', createResponse1.data.message);

    const createResponse2 = await axios.post(`${BASE_URL}/feedback`, testFeedback2);
    console.log('✅ Feedback 2 created:', createResponse2.data.message);

    // Test 2: Get doctor feedback
    console.log('\n2. Testing GET doctor feedback...');
    const doctorResponse = await axios.get(`${BASE_URL}/feedback/doctor/DOC001`);
    console.log('✅ Doctor feedback retrieved:');
    console.log('  - Total feedbacks:', doctorResponse.data.stats.totalFeedbacks);
    console.log('  - Average rating:', doctorResponse.data.stats.averageRating);
    console.log('  - Doctor name:', doctorResponse.data.doctor.name);

    // Test 3: Get patient feedback
    console.log('\n3. Testing GET patient feedback...');
    const patientResponse = await axios.get(`${BASE_URL}/feedback/patient/PAT001`);
    console.log('✅ Patient feedback retrieved:');
    console.log('  - Patient feedbacks:', patientResponse.data.feedbacks.length);

    console.log('\n🎉 All tests passed! Feedback API is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Only run if called directly (not if required as module)
if (require.main === module) {
  testFeedbackAPI();
}

module.exports = { testFeedbackAPI };
