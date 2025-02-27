import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator, 
  View, 
  TextInput,
  ScrollView,
  Alert,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import * as Speech from 'expo-speech';

import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { useColorScheme } from '@/components/ThemeProvider';
import { Colors } from '@/constants/Colors';
import { translateText } from '@/services/translationService';

// Define language options
const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese' },
];

// Storage key for translation history
const HISTORY_STORAGE_KEY = 'translation_history';

// History item type
type HistoryItem = {
  sourceText: string;
  translatedText: string;
  targetLanguage: string;
  timestamp: number;
};

export function SpeechTranslator() {
  const { colorScheme } = useColorScheme();
  const theme = colorScheme ?? 'light';
  
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('es');
  const [currentLanguage, setCurrentLanguage] = useState('Spanish');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  
  // Load translation history from storage
  useEffect(() => {
    loadHistory();
  }, []);
  
  const loadHistory = async () => {
    try {
      const savedHistory = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error('Failed to load history:', error);
    }
  };
  
  // Save translation to history
  const saveToHistory = async (item: HistoryItem) => {
    try {
      const updatedHistory = [item, ...history.slice(0, 9)]; // Keep last 10 items
      setHistory(updatedHistory);
      await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Failed to save to history:', error);
    }
  };
  
  // Select language
  const selectLanguage = (code: string) => {
    const selected = LANGUAGES.find(lang => lang.code === code);
    if (selected) {
      setTargetLanguage(code);
      setCurrentLanguage(selected.name);
      setShowLanguageSelector(false);
    }
  };
  
  // Handle translation
  const handleTranslate = async () => {
    if (!inputText.trim()) {
      Alert.alert('Error', 'Please enter text to translate');
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await translateText(inputText, targetLanguage);
      setTranslatedText(result);
      
      // Save to history
      const historyItem: HistoryItem = {
        sourceText: inputText,
        translatedText: result,
        targetLanguage,
        timestamp: Date.now()
      };
      saveToHistory(historyItem);
    } catch (error) {
      console.error('Translation failed:', error);
      Alert.alert('Translation Error', 'Failed to translate text. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Text-to-speech function
  const speakTranslation = async (text: string, language: string) => {
    try {
      // Stop any ongoing speech
      await Speech.stop();
      
      // Set speaking state
      setIsSpeaking(true);
      
      // Get available voices (optional, for better voice selection)
      const voices = await Speech.getAvailableVoicesAsync();
      
      // Find a voice for the target language
      const languageCode = language.substring(0, 2); // Get first 2 chars (e.g., 'en' from 'en-US')
      const matchingVoices = voices.filter(voice => 
        voice.language.startsWith(languageCode)
      );
      
      // Speak the translation
      Speech.speak(text, {
        language: language,
        voice: matchingVoices.length > 0 ? matchingVoices[0].identifier : undefined,
        pitch: 1.0,
        rate: 0.9,
        onDone: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
    } catch (error) {
      console.error('Speech error:', error);
      setIsSpeaking(false);
      Alert.alert('Speech Error', 'Unable to speak the translation.');
    }
  };
  
  // Clear history
  const clearHistory = () => {
    Alert.alert(
      "Clear History",
      "Are you sure you want to clear all translation history?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Clear", 
          style: "destructive",
          onPress: async () => {
            setHistory([]);
            await AsyncStorage.removeItem(HISTORY_STORAGE_KEY);
          }
        }
      ]
    );
  };
  
  // Format date for display
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };
  
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Text Translator</ThemedText>
      
      <View style={styles.contentContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.input, 
              {
                color: theme === 'dark' ? Colors.dark.text : Colors.light.text,
                backgroundColor: theme === 'dark' ? Colors.dark.card : Colors.light.card
              }
            ]}
            multiline
            placeholder="Enter text to translate..."
            placeholderTextColor={theme === 'dark' ? '#888' : '#aaa'}
            value={inputText}
            onChangeText={setInputText}
          />
        </View>
        
        <View style={styles.languageRow}>
          <TouchableOpacity 
            style={[
              styles.languageSelector,
              {backgroundColor: theme === 'dark' ? Colors.dark.card : Colors.light.card}
            ]}
            onPress={() => setShowLanguageSelector(!showLanguageSelector)}
          >
            <ThemedText style={styles.languageText}>
              Translate to: {currentLanguage}
            </ThemedText>
            <Ionicons 
              name={showLanguageSelector ? "chevron-up" : "chevron-down"} 
              size={20} 
              color={Colors[theme].tint} 
            />
          </TouchableOpacity>
        </View>
        
        {showLanguageSelector && (
          <ScrollView 
            style={[
              styles.languageList,
              {backgroundColor: theme === 'dark' ? Colors.dark.card : Colors.light.card}
            ]}
          >
            {LANGUAGES.map(lang => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.languageOption,
                  targetLanguage === lang.code && styles.selectedLanguage,
                  {
                    borderBottomColor: theme === 'dark' ? '#444' : '#eee'
                  }
                ]}
                onPress={() => selectLanguage(lang.code)}
              >
                <ThemedText style={targetLanguage === lang.code ? styles.selectedLanguageText : {}}>
                  {lang.name}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
        
        <TouchableOpacity
          style={[
            styles.button, 
            {backgroundColor: Colors[theme].tint},
            isLoading && styles.buttonDisabled
          ]}
          onPress={handleTranslate}
          disabled={isLoading || !inputText}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <ThemedText style={styles.buttonText} lightColor="#fff" darkColor="#fff">
              Translate
            </ThemedText>
          )}
        </TouchableOpacity>
        
        {translatedText ? (
          <ThemedView 
            style={[
              styles.resultBox, 
              {backgroundColor: theme === 'dark' ? Colors.dark.card : Colors.light.card}
            ]}
          >
            <View style={styles.resultHeader}>
              <ThemedText>{translatedText}</ThemedText>
              <TouchableOpacity 
                style={styles.speakButton}
                onPress={() => speakTranslation(translatedText, targetLanguage)}
                disabled={isSpeaking}
              >
                <Ionicons 
                  name={isSpeaking ? "volume-high" : "volume-medium-outline"} 
                  size={24} 
                  color={isSpeaking ? "#0a7ea4" : Colors[theme].icon} 
                />
              </TouchableOpacity>
            </View>
          </ThemedView>
        ) : null}
        
        {history.length > 0 && (
          <View style={styles.historyContainer}>
            <View style={styles.historyHeader}>
              <ThemedText type="subtitle">History</ThemedText>
              <TouchableOpacity onPress={clearHistory}>
                <Ionicons name="trash-outline" size={20} color="#ff4500" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.historyList}>
              {history.map((item, index) => (
                <ThemedView 
                  key={index} 
                  style={[
                    styles.historyItem,
                    {backgroundColor: theme === 'dark' ? Colors.dark.card : Colors.light.card}
                  ]}
                >
                  <View style={styles.historyItemHeader}>
                    <ThemedText type="small" style={styles.historyDate}>
                      {formatDate(item.timestamp)}
                    </ThemedText>
                    <TouchableOpacity
                      onPress={() => speakTranslation(item.translatedText, item.targetLanguage)}
                    >
                      <Ionicons 
                        name="volume-medium-outline" 
                        size={18} 
                        color={Colors[theme].icon} 
                      />
                    </TouchableOpacity>
                  </View>
                  <ThemedText>{item.sourceText}</ThemedText>
                  <ThemedText style={styles.historyTranslation}>
                    {item.translatedText}
                  </ThemedText>
                </ThemedView>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
  },
  contentContainer: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    padding: 12,
    borderRadius: 8,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  languageRow: {
    marginBottom: 16,
  },
  languageSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  languageText: {
    fontWeight: '500',
  },
  languageList: {
    maxHeight: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  languageOption: {
    padding: 12,
    borderBottomWidth: 1,
  },
  selectedLanguage: {
    backgroundColor: 'rgba(10, 126, 164, 0.1)',
  },
  selectedLanguageText: {
    fontWeight: 'bold',
    color: '#0a7ea4',
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    fontWeight: 'bold',
  },
  resultBox: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 16,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  speakButton: {
    padding: 5,
  },
  historyContainer: {
    flex: 1,
    marginTop: 16,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  historyList: {
    flex: 1,
  },
  historyItem: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  historyItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  historyDate: {
    opacity: 0.6,
  },
  historyTranslation: {
    marginTop: 8,
    fontStyle: 'italic',
  },
}); 