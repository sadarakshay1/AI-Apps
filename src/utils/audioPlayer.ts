// Audio Player utility for Gemini TTS (base64 WAV) and Web Speech API fallback

export class VoiceAssistant {
  private currentAudio: HTMLAudioElement | null = null;
  private isSpeaking: boolean = false;

  public async speakText(text: string, language: 'mr' | 'hi' | 'en' = 'mr', onStart?: () => void, onEnd?: () => void) {
    this.stop();
    this.isSpeaking = true;
    if (onStart) onStart();

    try {
      // 1. Try server-side Gemini TTS
      const res = await fetch('/api/ai/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, language })
      });

      const data = await res.json();

      if (data.audioData && !data.fallbackWebSpeech) {
        const audioSrc = `data:${data.format || 'audio/wav'};base64,${data.audioData}`;
        const audio = new Audio(audioSrc);
        this.currentAudio = audio;

        audio.onended = () => {
          this.isSpeaking = false;
          if (onEnd) onEnd();
        };

        audio.onerror = () => {
          this.fallbackBrowserSpeech(text, language, onEnd);
        };

        await audio.play();
        return;
      }
    } catch (err) {
      console.warn('Server TTS failed, falling back to Web Speech API', err);
    }

    // 2. Fallback to browser SpeechSynthesis
    this.fallbackBrowserSpeech(text, language, onEnd);
  }

  private fallbackBrowserSpeech(text: string, language: 'mr' | 'hi' | 'en', onEnd?: () => void) {
    if (!('speechSynthesis' in window)) {
      this.isSpeaking = false;
      if (onEnd) onEnd();
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);

    // Language code mapping
    if (language === 'mr') {
      utterance.lang = 'mr-IN';
    } else if (language === 'hi') {
      utterance.lang = 'hi-IN';
    } else {
      utterance.lang = 'en-IN';
    }

    // Try finding an Indian female or local voice
    const voices = window.speechSynthesis.getVoices();
    const targetVoice = voices.find(v => 
      (v.lang.startsWith(utterance.lang) || v.lang.startsWith('hi') || v.lang.startsWith('mr')) &&
      (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('aditi') || v.name.toLowerCase().includes('radha') || v.name.toLowerCase().includes('google') || v.name.toLowerCase().includes('kalpana'))
    ) || voices.find(v => v.lang.startsWith(utterance.lang)) || voices[0];

    if (targetVoice) {
      utterance.voice = targetVoice;
    }

    utterance.pitch = 1.1; // Gentle, pleasant female tone
    utterance.rate = 0.95;  // Courteous pace

    utterance.onend = () => {
      this.isSpeaking = false;
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
  }

  public stop() {
    this.isSpeaking = false;
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  public getSpeakingState(): boolean {
    return this.isSpeaking;
  }
}

export const voiceAssistant = new VoiceAssistant();
