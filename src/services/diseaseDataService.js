import axios from 'axios';

class DiseaseDataService {
  getDiseases() {
    return [
      {
        id: 1,
        name: 'Common Cold',
        symptoms: ['runny nose', 'sneezing', 'cough', 'sore throat', 'congestion'],
        description: 'A viral infection of the upper respiratory tract that typically resolves on its own within 7-10 days.',
        treatment: 'Rest, fluids, over-the-counter cold medications',
        severity: 2,
        keywords: ['cold', 'stuffy', 'mucus', 'nasal']
      },
      {
        id: 2,
        name: 'Influenza (Flu)',
        symptoms: ['fever', 'chills', 'body aches', 'fatigue', 'cough', 'headache'],
        description: 'A contagious respiratory illness caused by influenza viruses that can cause mild to severe illness.',
        treatment: 'Rest, fluids, antiviral medications if prescribed',
        severity: 5,
        keywords: ['flu', 'influenza', 'high fever', 'muscle pain']
      },
      {
        id: 3,
        name: 'Migraine',
        symptoms: ['severe headache', 'throbbing pain', 'nausea', 'sensitivity to light', 'sensitivity to sound'],
        description: 'A neurological condition characterized by intense, debilitating headaches often accompanied by other symptoms.',
        treatment: 'Pain relievers, triptans, preventive medications',
        severity: 6,
        keywords: ['migraine', 'headache', 'aura', 'vomiting']
      },
      {
        id: 4,
        name: 'Gastroenteritis',
        symptoms: ['diarrhea', 'nausea', 'vomiting', 'stomach cramps', 'fever'],
        description: 'Inflammation of the stomach and intestines, typically resulting from a viral or bacterial infection.',
        treatment: 'Fluids, rest, bland diet, probiotics',
        severity: 4,
        keywords: ['stomach flu', 'food poisoning', 'stomach bug']
      },
      {
        id: 5,
        name: 'Allergic Rhinitis',
        symptoms: ['sneezing', 'runny nose', 'itchy eyes', 'congestion', 'watery eyes'],
        description: 'An allergic response to specific allergens such as pollen, dust, or pet dander.',
        treatment: 'Antihistamines, nasal corticosteroids, avoiding allergens',
        severity: 3,
        keywords: ['allergy', 'hay fever', 'seasonal allergies']
      },
      {
        id: 6,
        name: 'Urinary Tract Infection',
        symptoms: ['frequent urination', 'burning sensation when urinating', 'cloudy urine', 'pelvic pain', 'strong-smelling urine'],
        description: 'An infection in any part of the urinary system, including kidneys, bladder, ureters, and urethra.',
        treatment: 'Antibiotics, increased fluid intake',
        severity: 5,
        keywords: ['UTI', 'bladder infection', 'cystitis']
      },
      {
        id: 7,
        name: 'Hypertension',
        symptoms: ['headache', 'shortness of breath', 'nosebleeds', 'dizziness', 'chest pain'],
        description: 'A chronic condition in which the blood pressure in the arteries is elevated.',
        treatment: 'Lifestyle changes, medications',
        severity: 7,
        keywords: ['high blood pressure', 'elevated blood pressure']
      },
      {
        id: 8,
        name: 'Asthma',
        symptoms: ['wheezing', 'shortness of breath', 'chest tightness', 'coughing', 'difficulty breathing'],
        description: 'A condition in which airways narrow and swell, producing extra mucus, making breathing difficult.',
        treatment: 'Inhalers, bronchodilators, avoiding triggers',
        severity: 6,
        keywords: ['asthma attack', 'breathing problems', 'inhaler']
      },
      {
        id: 9,
        name: 'Anxiety Disorder',
        symptoms: ['excessive worry', 'restlessness', 'fatigue', 'difficulty concentrating', 'irritability', 'sleep problems'],
        description: 'A mental health disorder characterized by feelings of worry, anxiety, or fear that are strong enough to interfere with daily activities.',
        treatment: 'Therapy, medication, stress management techniques',
        severity: 5,
        keywords: ['anxiety', 'panic', 'stress', 'nervous']
      },
      {
        id: 10,
        name: 'COVID-19',
        symptoms: ['fever', 'cough', 'shortness of breath', 'fatigue', 'loss of taste or smell', 'sore throat'],
        description: 'A respiratory illness caused by the SARS-CoV-2 virus that can range from mild to severe.',
        treatment: 'Rest, fluids, over-the-counter fever reducers, medical care for severe cases',
        severity: 8,
        keywords: ['coronavirus', 'covid', 'loss of smell', 'loss of taste']
      }
    ];
  }
  
  getDoctors() {
    return [
      {
        id: 1,
        name: 'Dr. Sarah Johnson',
        specialty: 'General Practitioner',
        location: 'City Medical Center',
        phone: '555-123-4567',
        availability: 'Mon-Fri, 9am-5pm'
      },
      {
        id: 2,
        name: 'Dr. Michael Chen',
        specialty: 'Pulmonologist',
        location: 'Respiratory Care Clinic',
        phone: '555-234-5678',
        availability: 'Tue-Thu, 10am-6pm'
      },
      {
        id: 3,
        name: 'Dr. Priya Patel',
        specialty: 'Neurologist',
        location: 'Neurology Associates',
        phone: '555-345-6789',
        availability: 'Mon, Wed, Fri, 8am-4pm'
      },
      {
        id: 4,
        name: 'Dr. James Wilson',
        specialty: 'Gastroenterologist',
        location: 'Digestive Health Center',
        phone: '555-456-7890',
        availability: 'Mon-Thu, 9am-5pm'
      },
      {
        id: 5,
        name: 'Dr. Maria Rodriguez',
        specialty: 'Allergist',
        location: 'Allergy & Asthma Clinic',
        phone: '555-567-8901',
        availability: 'Tue-Fri, 8:30am-4:30pm'
      }
    ];
  }
}

// Create an instance first, then export it
const diseaseDataService = new DiseaseDataService();
export default diseaseDataService;