import Papa from 'papaparse';

// Cache for parsed data
let diseasesAndSymptomsCache = null;
let diseasePrecautionsCache = null;

// Hardcoded disease and symptom data since CSV files aren't available
const hardcodedDiseaseData = [
  {
    name: "Common Cold",
    symptoms: ["runny nose", "sneezing", "cough", "sore throat", "congestion", "body ache", "headache", "fatigue"],
    severity: 2
  },
  {
    name: "Influenza",
    symptoms: ["fever", "chills", "body aches", "fatigue", "cough", "headache", "sore throat", "runny nose", "congestion", "nausea", "vomiting"],
    severity: 5
  },
  {
    name: "Migraine",
    symptoms: ["severe headache", "throbbing pain", "nausea", "sensitivity to light", "sensitivity to sound", "blurred vision", "dizziness", "fatigue"],
    severity: 6
  },
  {
    name: "Allergic Rhinitis",
    symptoms: ["sneezing", "runny nose", "itchy eyes", "congestion", "watery eyes", "itchy nose", "itchy throat", "fatigue"],
    severity: 3
  },
  {
    name: "Asthma",
    symptoms: ["wheezing", "shortness of breath", "chest tightness", "coughing", "difficulty breathing", "fatigue", "anxiety", "rapid breathing"],
    severity: 7
  },
  {
    name: "Hypertension",
    symptoms: ["headache", "shortness of breath", "nosebleeds", "dizziness", "chest pain", "fatigue", "vision problems", "anxiety"],
    severity: 7
  },
  {
    name: "Diabetes",
    symptoms: ["increased thirst", "frequent urination", "extreme hunger", "unexplained weight loss", "fatigue", "blurred vision", "slow-healing sores", "frequent infections"],
    severity: 8
  },
  {
    name: "Gastroenteritis",
    symptoms: ["diarrhea", "nausea", "vomiting", "stomach cramps", "fever", "headache", "loss of appetite", "dehydration"],
    severity: 5
  },
  {
    name: "Urinary Tract Infection",
    symptoms: ["frequent urination", "burning sensation when urinating", "cloudy urine", "pelvic pain", "strong-smelling urine", "fatigue", "fever", "back pain"],
    severity: 6
  },
  {
    name: "COVID-19",
    symptoms: ["fever", "cough", "shortness of breath", "fatigue", "loss of taste or smell", "sore throat", "body aches", "headache", "congestion", "nausea", "diarrhea", "chills"],
    severity: 8
  }
];

// Hardcoded precaution data
const hardcodedPrecautionData = {
  "Common Cold": ["rest", "hydration", "over-the-counter medications", "warm fluids"],
  "Influenza": ["rest", "hydration", "antiviral medications", "avoid contact with others"],
  "Migraine": ["rest in dark room", "pain relievers", "avoid triggers", "stay hydrated"],
  "Allergic Rhinitis": ["avoid allergens", "antihistamines", "nasal sprays", "air purifiers"],
  "Asthma": ["avoid triggers", "use inhaler", "follow action plan", "regular check-ups"],
  "Hypertension": ["reduce salt intake", "regular exercise", "medication", "stress management"],
  "Diabetes": ["monitor blood sugar", "healthy diet", "regular exercise", "medication"],
  "Gastroenteritis": ["hydration", "rest", "bland diet", "probiotics"],
  "Urinary Tract Infection": ["antibiotics", "hydration", "cranberry juice", "good hygiene"],
  "COVID-19": ["isolation", "rest", "hydration", "seek medical care if severe"]
};

// Function to fetch and parse CSV data - now just returns hardcoded data
const fetchCSV = async (url) => {
  console.log(`CSV files not available, using hardcoded data instead of ${url}`);
  return [];
};

// Get diseases and symptoms data
export const getDiseasesAndSymptoms = async () => {
  if (diseasesAndSymptomsCache) {
    return diseasesAndSymptomsCache;
  }

  console.log("Using hardcoded disease and symptom data");
  diseasesAndSymptomsCache = hardcodedDiseaseData;
  return hardcodedDiseaseData;
};

// Get disease precautions data
export const getDiseasePrecautions = async () => {
  if (diseasePrecautionsCache) {
    return diseasePrecautionsCache;
  }

  console.log("Using hardcoded precaution data");
  diseasePrecautionsCache = hardcodedPrecautionData;
  return hardcodedPrecautionData;
};

// Function to analyze symptoms text and find matching diseases
export const analyzeSymptomsText = async (symptomsText) => {
  const diseases = await getDiseasesAndSymptoms();
  const precautions = await getDiseasePrecautions();
  
  const text = symptomsText.toLowerCase();
  const matchedDiseases = [];
  
  // Extract individual words and phrases from the text
  const words = text.split(/\s+/);
  const phrases = [];
  
  // Create phrases of 2-3 words for better matching
  for (let i = 0; i < words.length - 1; i++) {
    phrases.push(`${words[i]} ${words[i + 1]}`);
    if (i < words.length - 2) {
      phrases.push(`${words[i]} ${words[i + 1]} ${words[i + 2]}`);
    }
  }
  
  // Check each disease for symptom matches
  diseases.forEach(disease => {
    let matchScore = 0;
    let matchedSymptoms = [];
    
    // Check each symptom against the text
    disease.symptoms.forEach(symptom => {
      // Direct match in the full text
      if (text.includes(symptom)) {
        matchScore += 3;
        matchedSymptoms.push(symptom);
      } else {
        // Check if any words or phrases match the symptom
        const symptomWords = symptom.split(/\s+/);
        
        // Single word match
        symptomWords.forEach(word => {
          if (word.length > 3 && words.includes(word)) {
            matchScore += 1;
            if (!matchedSymptoms.includes(symptom)) {
              matchedSymptoms.push(symptom);
            }
          }
        });
        
        // Phrase match
        phrases.forEach(phrase => {
          if (symptom.includes(phrase)) {
            matchScore += 2;
            if (!matchedSymptoms.includes(symptom)) {
              matchedSymptoms.push(symptom);
            }
          }
        });
      }
    });
    
    if (matchScore > 0) {
      // Add precautions if available
      const treatment = precautions[disease.name] 
        ? precautions[disease.name].join(', ') 
        : 'Consult a healthcare professional for treatment options';
      
      matchedDiseases.push({
        ...disease,
        matchScore,
        matchedSymptoms,
        description: `A condition characterized by symptoms such as ${disease.symptoms.slice(0, 3).join(', ')}${disease.symptoms.length > 3 ? ', and others' : ''}.`,
        treatment
      });
    }
  });
  
  // Sort by match score
  matchedDiseases.sort((a, b) => b.matchScore - a.matchScore);
  
  // Determine if doctor is needed
  const needsDoctor = determineIfDoctorNeeded(matchedDiseases, text);
  
  // Determine severity
  const severity = determineSeverity(matchedDiseases, text);
  
  // Only return top matches if we have any
  const possibleConditions = matchedDiseases.length > 0 
    ? matchedDiseases.slice(0, 3) // Top 3 matches
    : [];
  
  return {
    possibleConditions,
    needsDoctor,
    severity
  };
};

// Helper function to determine if doctor is needed
const determineIfDoctorNeeded = (matchedDiseases, text) => {
  // Check for emergency keywords
  const emergencyKeywords = ['emergency', 'severe', 'unbearable', 'extreme', 'worst', 'pain', 'cannot', 'unable'];
  for (const keyword of emergencyKeywords) {
    if (text.includes(keyword)) {
      return true;
    }
  }
  
  // Check disease severity
  if (matchedDiseases.length > 0) {
    // Only recommend doctor for more severe conditions
    if (matchedDiseases[0].severity >= 7) {
      return true;
    }
    // For medium severity, check if symptoms are concerning
    else if (matchedDiseases[0].severity >= 5) {
      const concerningSymptoms = ['breathing', 'chest', 'heart', 'blood', 'unconscious', 'faint'];
      for (const symptom of concerningSymptoms) {
        if (text.includes(symptom)) {
          return true;
        }
      }
    }
    // For common conditions, don't automatically recommend a doctor
    return false;
  }
  
  // Only recommend doctor if no matches and symptoms sound concerning
  const concerningWords = ['worried', 'concerned', 'unusual', 'never', 'strange', 'abnormal'];
  for (const word of concerningWords) {
    if (text.includes(word)) {
      return true;
    }
  }
  
  return false; // Don't recommend doctor by default
};

// Helper function to determine severity
const determineSeverity = (matchedDiseases, text) => {
  if (matchedDiseases.length === 0) {
    // Check for concerning words to determine severity when no matches
    const highSeverityWords = ['emergency', 'severe', 'extreme', 'worst', 'unbearable'];
    const mediumSeverityWords = ['worried', 'concerned', 'unusual', 'pain'];
    
    for (const word of highSeverityWords) {
      if (text.includes(word)) {
        return 'high';
      }
    }
    
    for (const word of mediumSeverityWords) {
      if (text.includes(word)) {
        return 'medium';
      }
    }
    
    return 'low'; // Default to low if no concerning words
  }
  
  const topDisease = matchedDiseases[0];
  
  // More nuanced severity assessment based on disease and match score
  if (topDisease.severity >= 8 || topDisease.matchScore >= 10) {
    return 'high';
  } else if (topDisease.severity >= 5 || topDisease.matchScore >= 6) {
    return 'medium';
  } else {
    // Common conditions like cold, mild fever should be low severity
    const commonConditions = ['cold', 'flu', 'fever', 'cough', 'headache', 'allergy'];
    if (commonConditions.some(condition => topDisease.name.toLowerCase().includes(condition))) {
      return 'low';
    }
    
    return 'low';
  }
};