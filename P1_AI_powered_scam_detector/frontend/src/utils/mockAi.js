// Comprehensive Scam Type Classification Logic
const determineScamDetails = (text, fileRisk) => {
  const t = text.toLowerCase();
  let scamType = "Unknown Suspicious Activity";
  let indicators = [];
  let similarity = "Low";
  
  // 1. Scam Type Classification
  if (t.includes('bank') || t.includes('kyc') || t.includes('verify') || t.includes('account blocked')) {
    scamType = "Bank / Authority Impersonation";
  } else if (t.includes('invest') || t.includes('profit') || t.includes('crypto') || t.includes('return')) {
    scamType = "Investment Scam";
  } else if (t.includes('winner') || t.includes('lottery') || t.includes('prize') || t.includes('reward')) {
    scamType = "Prize / Reward Scam";
  } else if (t.includes('job') || t.includes('hiring') || t.includes('salary')) {
    scamType = "Job / Employment Scam";
  } else if (fileRisk) {
    scamType = "Malicious File Attachment";
  }

  // 2. Risk Indicators (Visual Breakdown)
  if (t.includes('urgent') || t.includes('immediately') || t.includes('24 hours')) indicators.push("Urgency or Pressure to Act");
  if (t.includes('link') || t.includes('click') || t.includes('http')) indicators.push("Suspicious Link Request");
  if (t.includes('password') || t.includes('otp') || t.includes('pin')) indicators.push("Request for Sensitive Credentials");
  if (t.includes('pay') || t.includes('transfer') || t.includes('fee')) indicators.push("Upfront Payment Request");
  if (fileRisk) indicators.push("Suspicious File Metadata");
  
  if (indicators.length === 0) indicators.push("Unusual language patterns");

  // 3. Similarity Score (Mocked)
  if (indicators.length >= 2) similarity = "High";
  else if (indicators.length === 1) similarity = "Medium";

  return { scamType, indicators, similarity };
};

export const analyzeMessage = async (text, files = []) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let riskLevel = 'safe';
      let score = 10;
      let reasons = [];
      let advice = "No immediate threats detected. Always stay vigilant.";
      let fileRisk = false;
      let fileReasons = [];

      // File Analysis
      if (files.length > 0) {
        files.forEach(file => {
          const name = file.name.toLowerCase();
          if (name.includes('winner') || name.includes('lottery') || name.includes('urgent') || name.includes('apk')) {
            fileRisk = true;
            fileReasons.push(`Suspicious file name detected: "${file.name}"`);
          }
        });
      }

      // Text Analysis
      const lowerText = text.toLowerCase();
      
      const suspiciousKeywords = ['verify', 'account', 'security', 'click', 'link', 'update', 'suspended', 'kyc'];
      const highRiskKeywords = ['urgent', 'password', 'winner', 'lottery', 'transfer', 'bank', 'ssn', 'credit card', 'otp'];

      let suspiciousCount = 0;
      let highRiskCount = 0;

      suspiciousKeywords.forEach(word => {
        if (lowerText.includes(word)) suspiciousCount++;
      });

      highRiskKeywords.forEach(word => {
        if (lowerText.includes(word)) highRiskCount++;
      });

      // Risk Determination
      if (highRiskCount > 0 || fileRisk) {
        riskLevel = 'high-risk';
        score = 85 + (highRiskCount * 5);
        if (score > 99) score = 99;
        
        reasons.push("Contains high-risk triggers often used in scams.");
        if (fileRisk) reasons.push(...fileReasons);
        if (lowerText.includes('urgent')) reasons.push("Uses urgency to pressure immediate action.");
        
        advice = "Do NOT click any links. Block the sender immediately.";
      } else if (suspiciousCount > 0) {
        riskLevel = 'suspicious';
        score = 45 + (suspiciousCount * 10);
        
        reasons.push("Contains keywords commonly found in phishing attempts.");
        advice = "Proceed with caution. Verify the sender's identity.";
      } else {
          // Safe Schema
          if(files.length > 0) {
             score = 20; 
             reasons.push("Files attached but no obvious threats detected.");
          } else {
             reasons.push("No common scam keywords or patterns detected.");
          }
      }

      // Rich Metadata Generation
      const details = determineScamDetails(text, fileRisk);

      resolve({
        riskLevel,
        score,
        scamType: details.scamType,
        riskIndicators: details.indicators,
        similarity: details.similarity,
        reasons: reasons,
        advice,
        simplifiedExplanation: `This looks like a ${details.scamType}. Scammers use words like "${details.indicators[0] || 'urgent'}" to trick you. Don't reply.`
      });
    }, 2500);
  });
};
