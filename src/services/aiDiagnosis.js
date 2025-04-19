import diseaseDataService from './diseaseDataService';

class AIDiagnosisService {
  constructor() {
    this.diseaseData = diseaseDataService.getDiseases();
  }

  // Simple keyword-based symptom analysis
  analyzeSymptomsText(symptomsText) {
    const text = symptomsText.toLowerCase();
    const matchedDiseases = [];
    
    // Check each disease for keyword matches
    this.diseaseData.forEach(disease => {
      let matchScore = 0;
      
      // Check symptoms
      disease.symptoms.forEach(symptom => {
        if (text.includes(symptom.toLowerCase())) {
          matchScore += 2;
        }
      });
      
      // Check keywords
      if (disease.keywords) {
        disease.keywords.forEach(keyword => {
          if (text.includes(keyword.toLowerCase())) {
            matchScore += 1;
          }
        });
      }
      
      if (matchScore > 0) {
        matchedDiseases.push({
          ...disease,
          matchScore
        });
      }
    });
    
    // Sort by match score
    matchedDiseases.sort((a, b) => b.matchScore - a.matchScore);
    
    return {
      possibleConditions: matchedDiseases.slice(0, 3),
      needsDoctor: this.determineIfDoctorNeeded(matchedDiseases, text),
      severity: this.determineSeverity(matchedDiseases, text)
    };
  }
  
  determineIfDoctorNeeded(matchedDiseases, text) {
    // Check for emergency keywords
    const emergencyKeywords = ['emergency', 'severe', 'unbearable', 'extreme', 'worst'];
    for (const keyword of emergencyKeywords) {
      if (text.includes(keyword)) {
        return true;
      }
    }
    
    // Check disease severity
    if (matchedDiseases.length > 0 && matchedDiseases[0].severity >= 7) {
      return true;
    }
    
    return matchedDiseases.length > 0;
  }
  
  determineSeverity(matchedDiseases, text) {
    if (matchedDiseases.length === 0) {
      return 'low';
    }
    
    const topDisease = matchedDiseases[0];
    
    if (topDisease.severity >= 8) {
      return 'high';
    } else if (topDisease.severity >= 5) {
      return 'medium';
    } else {
      return 'low';
    }
  }
}

// Create an instance first, then export it
const aiDiagnosisService = new AIDiagnosisService();
export default aiDiagnosisService;