// Mock data for doctors
const doctors = [
  {
    id: 1,
    name: "Dr. Rajesh Kumar",
    specialization: "Cardiologist",
    experience: "15+ years experience",
    hospital: "Apollo Hospitals",
    address: "21 Greams Lane, Chennai, Tamil Nadu 600006",
    phone: "9080187006", // Your number
    email: "rajesh.kumar@apollohospitals.com",
    availability: "Mon-Fri: 9:00 AM - 5:00 PM",
    rating: 4.8,
    image: "https://randomuser.me/api/portraits/men/1.jpg",
    location: {
      lat: 13.0827,
      lng: 80.2707
    },
    keywords: ["heart", "chest pain", "blood pressure", "cardiac", "cardiovascular"]
  },
  {
    id: 2,
    name: "Dr. Priya Sharma",
    specialization: "Neurologist",
    experience: "12+ years experience",
    hospital: "Fortis Hospital",
    address: "154, Bannerghatta Road, Bengaluru, Karnataka 560076",
    phone: "9080187006", // Your number
    email: "priya.sharma@fortishospital.com",
    availability: "Mon-Sat: 10:00 AM - 6:00 PM",
    rating: 4.7,
    image: "https://randomuser.me/api/portraits/women/2.jpg",
    location: {
      lat: 12.9716,
      lng: 77.5946
    },
    keywords: ["brain", "headache", "migraine", "nerve", "seizure", "stroke"]
  },
  {
    id: 3,
    name: "Dr. Amit Patel",
    specialization: "Orthopedic Surgeon",
    experience: "18+ years experience",
    hospital: "Max Super Speciality Hospital",
    address: "1, Press Enclave Road, Saket, New Delhi, Delhi 110017",
    phone: "9080187006", // Your number
    email: "amit.patel@maxhospital.com",
    availability: "Tue-Sun: 9:00 AM - 4:00 PM",
    rating: 4.9,
    image: "https://randomuser.me/api/portraits/men/3.jpg",
    location: {
      lat: 28.6139,
      lng: 77.2090
    },
    keywords: ["bone", "joint", "fracture", "knee", "back pain", "spine", "arthritis"]
  },
  {
    id: 4,
    name: "Dr. Sunita Reddy",
    specialization: "Pediatrician",
    experience: "10+ years experience",
    hospital: "Rainbow Children's Hospital",
    address: "8-2-19/1/A, Road No 2, Banjara Hills, Hyderabad, Telangana 500034",
    phone: "9080187006", // Your number
    email: "sunita.reddy@rainbowhospitals.com",
    availability: "Mon-Fri: 8:00 AM - 2:00 PM",
    rating: 4.6,
    image: "https://randomuser.me/api/portraits/women/4.jpg",
    location: {
      lat: 17.3850,
      lng: 78.4867
    },
    keywords: ["child", "fever", "cough", "cold", "vaccination", "growth", "development"]
  },
  {
    id: 5,
    name: "Dr. Vikram Singh",
    specialization: "Dermatologist",
    experience: "8+ years experience",
    hospital: "Manipal Hospital",
    address: "98, HAL Airport Road, Bengaluru, Karnataka 560017",
    phone: "9080187006", // Your number
    email: "vikram.singh@manipalhospital.com",
    availability: "Wed-Mon: 11:00 AM - 7:00 PM",
    rating: 4.5,
    image: "https://randomuser.me/api/portraits/men/5.jpg",
    location: {
      lat: 12.9584,
      lng: 77.6486
    },
    keywords: ["skin", "rash", "acne", "allergy", "hair loss", "eczema", "psoriasis"]
  }
];

// Get all doctors
export const getAllDoctors = () => {
  return doctors;
};

// Find doctors by symptoms
export const findDoctorsBySymptoms = (symptoms) => {
  const searchTerms = symptoms.toLowerCase().split(/\s+/);
  
  return doctors.filter(doctor => {
    // Check if any keyword matches any search term
    return doctor.keywords.some(keyword => 
      searchTerms.some(term => keyword.toLowerCase().includes(term))
    ) || 
    // Check if specialization matches any search term
    searchTerms.some(term => 
      doctor.specialization.toLowerCase().includes(term)
    );
  });
};

// Function to send SMS using Way2SMS API
const sendSMS = async (doctorName, phoneNumber, message) => {
  try {
    // For demo purposes, we'll simulate a successful SMS
    // In a production environment, you would integrate with Way2SMS or similar service
    
    // Remove the +91 prefix if present for Way2SMS format
    if (phoneNumber.startsWith('+91')) {
      phoneNumber = phoneNumber.substring(3);
    }
    
    console.log(`[DEMO SMS] To: ${phoneNumber}, Message: ${message}`);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For a real implementation with Way2SMS, you would use code like:
    /*
    const url = 'https://www.way2sms.com/api/v1/sendCampaign';
    const data = new URLSearchParams();
    data.append('apikey', 'YOUR_API_KEY');
    data.append('secret', 'YOUR_SECRET_KEY');
    data.append('usetype', 'stage');
    data.append('phone', phoneNumber);
    data.append('message', message);
    data.append('senderid', 'YOUR_SENDER_ID');
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: data
    });
    
    const result = await response.json();
    */
    
    // For now, we'll simulate a successful response
    return {
      success: true,
      message: "SMS sent successfully (demo mode)"
    };
  } catch (error) {
    console.error("Error in sendSMS:", error);
    return {
      success: false,
      message: "Error sending SMS: " + error.message
    };
  }
};

// Request a call from doctor
export const requestDoctorCall = async (doctorId, patientInfo) => {
  try {
    // Format phone number for Indian format
    let phoneNumber = "9080187006";
    
    // Prepare the message content
    const message = `SpeakToCure: Patient ${patientInfo.name} (${patientInfo.phone}) needs consultation for: ${patientInfo.symptoms ? patientInfo.symptoms.substring(0, 50) : "Not specified"}. Doctor: ${patientInfo.doctorName}, Hospital: ${patientInfo.hospital}`;
    
    console.log("Sending SMS to:", phoneNumber);
    console.log("Message:", message);
    
    // In a real implementation, this would send an actual SMS
    const response = await sendSMS(patientInfo.doctorName, phoneNumber, message);
    
    console.log("SMS sending response:", response);
    
    // For demo purposes, we'll show a success message regardless
    // In production, you would check response.success
    return {
      success: true,
      message: "Request sent successfully! The doctor will call you soon."
    };
  } catch (error) {
    console.error("Error sending SMS:", error);
    // For demo purposes, still show success
    return {
      success: true,
      message: "Request sent successfully! The doctor will call you soon."
    };
  }
};