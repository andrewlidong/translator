# Speech Translator App

A React Native mobile application that translates text between multiple languages and provides text-to-speech functionality.

## Features

- Translate text between 8 languages
- Text-to-speech pronunciation
- Dark/light theme support
- Translation history
- Clean, modern UI

## Technologies Used

- React Native
- Expo
- TypeScript
- React Navigation
- Expo Speech API
- AsyncStorage for local data persistence

## Getting Started

### Prerequisites

- Node.js
- npm or yarn
- Expo CLI

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/speech-translator.git
   cd speech-translator
   ```

2. Install dependencies
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```

3. Create a `.env` file in the root directory and add your API keys (see `.env.example` for structure)

4. Start the development server
   ```
   npx expo start
   ```

## Setting Up Translation API

This app uses a mock translation service by default. To use a real translation API:

1. Get an API key from Google Cloud Translation API or another provider
2. Add your API key to the `.env` file
3. Uncomment the API code in `services/translationService.ts`

## License

This project is licensed under the MIT License - see the LICENSE file for details.
