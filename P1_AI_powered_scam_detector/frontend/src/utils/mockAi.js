export const analyzeMessage = async (text) => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      const lowerText = text.toLowerCase();
      
      // Heuristic Logic for MVP
      if (
        lowerText.includes('urgent') || 
        lowerText.includes('immediately') || 
        lowerText.includes('verify') || 
        lowerText.includes('kyc') ||
        lowerText.includes('block')
      ) {
         resolve({
           riskLevel: 'suspicious',
           score: 65,
           reasons: [
             'Creates a false sense of urgency',
             'Requests immediate action',
             'Potential account blocking threat'
           ],
           advice: 'Do not click any links. Verify directly with the official app or website.'
         });
      } else if (
        lowerText.includes('winner') || 
        lowerText.includes('lottery') || 
        lowerText.includes('transfer') || 
        lowerText.includes('password') || 
        lowerText.includes('otp') ||
        lowerText.includes('bank')
      ) {
        resolve({
          riskLevel: 'high-risk',
          score: 88,
          reasons: [
             'Mentions financial keywords (transfer/lottery)',
             'Requests sensitive information',
             'Unknown sender pattern detected'
          ],
          advice: 'Obvious scam. Do not reply. Block this number immediately.'
        });
      } else {
        resolve({
          riskLevel: 'safe',
          score: 10,
          reasons: [
            'No urgent language detected',
            'No sensitive requests found',
            'Standard conversation pattern'
          ],
          advice: 'Message appears safe, but always stay vigilant.'
        });
      }
    }, 2000); // 2 second delay for realism
  });
};
