class TextToSpeechService {
  constructor() {
    this.synth = window.speechSynthesis;
    this.utterance = null;
  }

  speak(text, lang = 'en-US') {
    // Stop any current speech
    this.stop();
    
    // Create a new utterance
    this.utterance = new SpeechSynthesisUtterance(text);
    this.utterance.lang = lang;
    this.utterance.rate = 0.9; // Slightly slower than default
    this.utterance.pitch = 1;
    
    // Start speaking
    this.synth.speak(this.utterance);
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  pause() {
    if (this.synth) {
      this.synth.pause();
    }
  }

  resume() {
    if (this.synth) {
      this.synth.resume();
    }
  }
}

// Create an instance first, then export it
const textToSpeechService = new TextToSpeechService();
export default textToSpeechService;