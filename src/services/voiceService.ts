// Voice Recognition service utilizing Browser Web Speech API

interface IWindow extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

const _window = window as unknown as IWindow;
const SpeechRecognition = _window.SpeechRecognition || _window.webkitSpeechRecognition;

export const isVoiceSupported = () => {
  return !!SpeechRecognition;
};

let recognition: any = null;

export const startVoiceRecognition = (
  onResult: (text: string) => void,
  onEnd: () => void,
  onError: (err: string) => void,
  lang: 'en' | 'hi' | 'gu' = 'en'
) => {
  if (!isVoiceSupported()) {
    onError("Voice recognition is not supported in this browser. Please type your complaint.");
    return;
  }

  try {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    // Set appropriate language locale
    if (lang === 'hi') {
      recognition.lang = 'hi-IN';
    } else if (lang === 'gu') {
      recognition.lang = 'gu-IN';
    } else {
      recognition.lang = 'en-IN';
    }

    recognition.onstart = () => {
      console.log("Voice Recognition started...");
    };

    recognition.onresult = (event: any) => {
      const resultText = event.results[0][0].transcript;
      onResult(resultText);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      onError(`Speech recognition error: ${event.error}`);
    };

    recognition.onend = () => {
      console.log("Voice Recognition ended.");
      onEnd();
    };

    recognition.start();
  } catch (e: any) {
    onError(`Failed to start speech recognition: ${e.message}`);
  }
};

export const stopVoiceRecognition = () => {
  if (recognition) {
    try {
      recognition.stop();
    } catch (e) {
      console.error("Failed to stop recognition:", e);
    }
  }
};
