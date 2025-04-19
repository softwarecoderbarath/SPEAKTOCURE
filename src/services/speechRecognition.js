// Speech recognition service
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

class SpeechRecognitionService {
  constructor() {
    if (!SpeechRecognition) {
      console.error('Speech recognition not supported in this browser');
      this.isSupported = false;
      return;
    }
    
    this.isSupported = true;
    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
  }

  setLanguage(languageCode) {
    // Map app language to BCP 47 language tags
    const languageMap = {
      english: 'en-US',
      hindi: 'hi-IN',
      tamil: 'ta-IN',
      bengali: 'bn-IN',
      telugu: 'te-IN',
      marathi: 'mr-IN',
      gujarati: 'gu-IN',
      kannada: 'kn-IN',
      malayalam: 'ml-IN',
      punjabi: 'pa-IN',
    };
    
    this.recognition.lang = languageMap[languageCode.toLowerCase()] || 'en-US';
  }

  start(onResult, onError) {
    if (!this.isSupported) {
      onError('Speech recognition not supported');
      return;
    }
    
    this.recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('');
      
      onResult(transcript);
    };
    
    this.recognition.onerror = (event) => {
      onError(event.error);
    };
    
    this.recognition.start();
  }

  stop() {
    if (this.isSupported) {
      this.recognition.stop();
    }
  }
}

export default new SpeechRecognitionService();