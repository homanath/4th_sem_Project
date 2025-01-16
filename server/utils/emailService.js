// Mock email service for development
const sendEmail = async ({ to, subject, text, html }) => {
  console.log('====== MOCK EMAIL SERVICE ======');
  console.log('To:', to);
  console.log('Subject:', subject);
  console.log('Text:', text);
  console.log('HTML:', html || 'No HTML version');
  console.log('==============================');
  return { messageId: 'mock-email-id-' + Date.now() };
};

module.exports = sendEmail; 