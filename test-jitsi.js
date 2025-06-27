// Test Jitsi link generation
console.log('Testing Jitsi link generation...');

// Test data
const testPatientName = 'John Doe';
const testDoctorName = 'Dr. Smith';
const testScheduledDate = new Date('2025-06-30');
const testScheduledTime = '10:30';
const testMeetingType = 'online';

// The actual link generation logic from emailService.js
const generateJitsiLink = (patientName, doctorName, appointmentDate, appointmentTime) => {
  const roomName = `CareConnect-${patientName.replace(/\s+/g, '')}-${doctorName.replace(/\s+/g, '')}-${new Date(appointmentDate).toISOString().split('T')[0]}-${appointmentTime.replace(':', '')}`;
  const sanitizedRoomName = roomName.replace(/[^a-zA-Z0-9-]/g, '');
  return `https://meet.jit.si/${sanitizedRoomName}`;
};

console.log('Test appointment details:');
console.log('Patient:', testPatientName);
console.log('Doctor:', testDoctorName);
console.log('Date:', testScheduledDate.toDateString());
console.log('Time:', testScheduledTime);
console.log('Meeting Type:', testMeetingType);

const generatedLink = generateJitsiLink(testPatientName, testDoctorName, testScheduledDate, testScheduledTime);
console.log('\nGenerated Jitsi Link:', generatedLink);

// Verify link format
console.log('Link appears valid:', generatedLink.startsWith('https://meet.jit.si/') && generatedLink.length > 25);

// Test different names with special characters
const testCases = [
  { patient: 'Mary O\'Connor', doctor: 'Dr. José García' },
  { patient: 'Ahmed Al-Hassan', doctor: 'Dr. Wang Li' },
  { patient: 'Emma Thompson-Smith', doctor: 'Dr. Sarah Johnson' }
];

console.log('\nTesting with different names:');
testCases.forEach((testCase, index) => {
  const link = generateJitsiLink(testCase.patient, testCase.doctor, testScheduledDate, testScheduledTime);
  console.log(`${index + 1}. ${testCase.patient} + ${testCase.doctor}:`);
  console.log(`   ${link}`);
});
