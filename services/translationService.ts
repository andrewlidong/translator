import axios from 'axios';
import { GOOGLE_TRANSLATE_API_KEY } from '@env';

/**
 * Translates text using Google Cloud Translation API
 * @param text Text to translate
 * @param targetLanguage Target language code (e.g., 'es', 'fr')
 * @returns Promise with translated text
 */
export const translateText = async (text: string, targetLanguage: string): Promise<string> => {
  try {
    // Use Google Cloud Translation API
    const response = await axios.post(
      `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_TRANSLATE_API_KEY}`,
      {
        q: text,
        target: targetLanguage,
        format: 'text'
      }
    );
    
    // Extract translated text from response
    if (response.data && 
        response.data.data && 
        response.data.data.translations && 
        response.data.data.translations.length > 0) {
      return response.data.data.translations[0].translatedText;
    } else {
      throw new Error('Invalid response format from translation service');
    }
  } catch (error) {
    console.error('Translation error:', error);
    
    // If API call fails, fall back to mock translation
    return mockTranslate(text, targetLanguage);
  }
};

/**
 * Mock translation function for fallback or development
 */
const mockTranslate = (text: string, targetLanguage: string): Promise<string> => {
  // Simple mock translations for common phrases
  const mockPhrases: Record<string, Record<string, string>> = {
    "Hello": {
      es: "Hola",
      fr: "Bonjour",
      de: "Hallo",
      it: "Ciao",
      ja: "こんにちは",
      ko: "안녕하세요",
      zh: "你好"
    },
    "How are you?": {
      es: "¿Cómo estás?",
      fr: "Comment ça va?",
      de: "Wie geht es dir?",
      it: "Come stai?",
      ja: "お元気ですか？",
      ko: "어떻게 지내세요?",
      zh: "你好吗？"
    },
    "Thank you": {
      es: "Gracias",
      fr: "Merci",
      de: "Danke",
      it: "Grazie",
      ja: "ありがとう",
      ko: "감사합니다",
      zh: "谢谢"
    },
    "Goodbye": {
      es: "Adiós",
      fr: "Au revoir",
      de: "Auf Wiedersehen",
      it: "Arrivederci",
      ja: "さようなら",
      ko: "안녕히 가세요",
      zh: "再见"
    },
    "Yes": {
      es: "Sí",
      fr: "Oui",
      de: "Ja",
      it: "Sì",
      ja: "はい",
      ko: "예",
      zh: "是"
    },
    "No": {
      es: "No",
      fr: "Non",
      de: "Nein",
      it: "No",
      ja: "いいえ",
      ko: "아니요",
      zh: "不"
    }
  };

  // Check if we have a mock translation for this exact phrase
  if (mockPhrases[text] && mockPhrases[text][targetLanguage]) {
    return Promise.resolve(mockPhrases[text][targetLanguage]);
  }

  // Otherwise, create a mock translation
  let translatedText = text;
  
  // Add language-specific prefixes or modifications
  switch (targetLanguage) {
    case 'es':
      translatedText = '¡' + text.replace(/ing\b/g, 'ando').replace(/the\b/g, 'el') + '!';
      break;
    case 'fr':
      translatedText = text.replace(/the\b/g, 'le').replace(/is\b/g, 'est') + ' (en français)';
      break;
    case 'de':
      translatedText = text.replace(/the\b/g, 'die').replace(/is\b/g, 'ist') + ' (auf Deutsch)';
      break;
    case 'it':
      translatedText = text.replace(/the\b/g, 'il').replace(/is\b/g, 'è') + ' (in italiano)';
      break;
    case 'ja':
      translatedText = text + 'です';
      break;
    case 'ko':
      translatedText = text + '입니다';
      break;
    case 'zh':
      translatedText = text + '是';
      break;
    default:
      translatedText = text;
  }
  
  // Simulate network delay
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(translatedText);
    }, 500);
  });
};

// Keep your existing mock translation as fallback
function fallbackTranslation(text, targetLanguage) {
  // Mock translations for testing
  const translations: Record<string, Record<string, string>> = {
    'es': { // Spanish
      'hello': 'hola',
      'good morning': 'buenos días',
      'how are you': 'cómo estás',
      'thank you': 'gracias',
      'goodbye': 'adiós'
    },
    'fr': { // French
      'hello': 'bonjour',
      'good morning': 'bonjour',
      'how are you': 'comment allez-vous',
      'thank you': 'merci',
      'goodbye': 'au revoir'
    },
    'de': { // German
      'hello': 'hallo',
      'good morning': 'guten morgen',
      'how are you': 'wie geht es dir',
      'thank you': 'danke',
      'goodbye': 'auf wiedersehen'
    },
    'it': { // Italian
      'hello': 'ciao',
      'good morning': 'buongiorno',
      'how are you': 'come stai',
      'thank you': 'grazie',
      'goodbye': 'arrivederci'
    },
    'pt': { // Portuguese
      'hello': 'olá',
      'good morning': 'bom dia',
      'how are you': 'como vai você',
      'thank you': 'obrigado',
      'goodbye': 'adeus'
    },
    'zh': { // Chinese
      'hello': '你好',
      'good morning': '早上好',
      'how are you': '你好吗',
      'thank you': '谢谢',
      'goodbye': '再见'
    },
    'ja': { // Japanese
      'hello': 'こんにちは',
      'good morning': 'おはようございます',
      'how are you': 'お元気ですか',
      'thank you': 'ありがとう',
      'goodbye': 'さようなら'
    },
    'ko': { // Korean
      'hello': '안녕하세요',
      'good morning': '좋은 아침',
      'how are you': '어떻게 지내세요',
      'thank you': '감사합니다',
      'goodbye': '안녕히 가세요'
    },
    'ru': { // Russian
      'hello': 'привет',
      'good morning': 'доброе утро',
      'how are you': 'как дела',
      'thank you': 'спасибо',
      'goodbye': 'до свидания'
    }
  };
  
  // Check if we have translations for the target language
  if (translations[targetLanguage]) {
    const languageTranslations = translations[targetLanguage];
    const lowerText = text.toLowerCase();
    
    // Check if the text matches any of our mock translations
    for (const [eng, translation] of Object.entries(languageTranslations)) {
      if (lowerText.includes(eng)) {
        return translation;
      }
    }
  }
  
  // If no match or no translations for the language, return the original text with a prefix
  return `[${targetLanguage}] ${text}`;
} 