export const analyzeMessage = async (text, files = []) => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      const lowerText = text.toLowerCase();
      let fileRisk = false;
      let fileReasons = [];

      // Mock file analysis
      if (files.length > 0) {
        files.forEach(file => {
          const name = file.name.toLowerCase();
          if (name.includes('winner') || name.includes('lottery') || name.includes('urgent')) {
            fileRisk = true;
            fileReasons.push(`Suspicious file name detected: "${file.name}"`);
          }
          if (file.type.startsWith('audio/')) {
             // Simulate audio analysis
             if (files.length === 1 && !text) {
                 // specific case if only audio is uploaded
                 fileReasons.push('Audio content analyzes as high pressure/urgency.');
             }
          }
        });
      }

      // Heuristic Logic for MVP
      if (
        lowerText.includes('urgent') || 
        lowerText.includes('immediately') || 
        lowerText.includes('verify') || 
        lowerText.includes('kyc') ||
        lowerText.includes('block') ||
        (fileRisk && !lowerText.includes('bank')) // Mix file risk
      ) {
         resolve({
           riskLevel: 'suspicious',
           score: 65,
           reasons: [
             'Creates a false sense of urgency',
             'Requests immediate action',
             'Potential account blocking threat',
             ...fileReasons
           ],
           advice: 'Do not click any links. Verify directly with the official app or website.'
         });
      } else if (
        lowerText.includes('winner') || 
        lowerText.includes('lottery') || 
        lowerText.includes('transfer') || 
        lowerText.includes('password') || 
        lowerText.includes('otp') ||
        lowerText.includes('bank') ||
        fileRisk
      ) {
        resolve({
          riskLevel: 'high-risk',
          score: 88,
          reasons: [
             'Mentions financial keywords (transfer/lottery)',
             'Requests sensitive information',
             'Unknown sender pattern detected',
             ...fileReasons
           ],
           advice: 'Obvious scam. Do not reply. Block this number immediately.'
         });
      } else {
        // Safe case
        if (files.length > 0) {
            resolve({
                riskLevel: 'safe',
                score: 15, // Slightly higher than 10 just because files exist
                reasons: [
                  'No urgent language detected',
                  'Attachments appear standard',
                  'Standard conversation pattern'
                ],
                advice: 'Message and attachments appear safe, but always stay vigilant.'
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
      }
    }, 2500); // Slightly longer delay for "multimodal" processing
  });
};
