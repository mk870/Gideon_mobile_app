import { StyleSheet } from "react-native";

export const Styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#0a0e27',
  },
  statusCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
  statusIcon: {
    fontSize: 60,
    color: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
    color: '#fff',
  },
  listeningIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    height: 40,
  },
  wave: {
    width: 4,
    backgroundColor: '#2196F3',
    marginHorizontal: 3,
    borderRadius: 2,
  },
  wave1: {
    height: 20,
  },
  wave2: {
    height: 35,
  },
  wave3: {
    height: 25,
  },
  button: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 50,
    paddingVertical: 18,
    borderRadius: 30,
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
    minWidth: 200,
  },
  buttonActive: {
    backgroundColor: '#f44336',
    shadowColor: '#f44336',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  errorContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#ff5252',
    borderRadius: 10,
    width: '100%',
  },
  errorText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: 40,
    width: '100%',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    backgroundColor: '#1a1f3a',
    padding: 20,
    borderRadius: 15,
    minWidth: 140,
  },
  statLabel: {
    fontSize: 12,
    color: '#8b92b0',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  infoContainer: {
    marginTop: 30,
    padding: 20,
    backgroundColor: '#1a1f3a',
    borderRadius: 15,
    width: '100%',
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#8b92b0',
    lineHeight: 22,
  },
  customKeywordInfo: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#2d1b4e',
    borderRadius: 10,
    width: '100%',
    borderWidth: 1,
    borderColor: '#7c4dff',
  },
  customKeywordTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#b39ddb',
    marginBottom: 5,
  },
  customKeywordText: {
    fontSize: 12,
    color: '#9575cd',
    textAlign: 'center',
  },
});


// {
//   "expo": {
//     "name": "gideon",
//     "slug": "gideon",
//     "version": "1.0.0",
//     "orientation": "portrait",
//     "icon": "./assets/images/icon.png",
//     "scheme": "gideon",
//     "userInterfaceStyle": "dark",
//     "backgroundColor": "#000000",
//     "newArchEnabled": true,
//     "ios": {
//       "supportsTablet": true,
//       "userInterfaceStyle": "dark",
//       "backgroundColor": "#000000",
//       "infoPlist": {
//         "NSMicrophoneUsageDescription": "This app needs microphone access to detect the wake word 'Gideon'",
//         "NSSpeechRecognitionUsageDescription": "This app needs speech recognition to detect the wake word 'Gideon'"
//       },
//       "icon":{
//         "dark": "./assets/icons/ios-dark.png",
//         "light": "./assets/icons/ios-light.png",
//         "tinted": "./assets/icons/ios-tinted.png"
//       }
//     },
//     "android": {
//       "adaptiveIcon": {
//         "backgroundColor": "#FFFFFF",
//         "foregroundImage": "./assets/icons/adaptive-icon.png",
//         "monochromeImage": "./assets/icons/adaptive-icon.png"
//       },
//       "userInterfaceStyle": "dark",
//       "edgeToEdgeEnabled": true,
//       "predictiveBackGestureEnabled": false,
//       "permissions": ["RECORD_AUDIO"],
//       "package": "com.anonymous.gideon"
//     },
//     "web": {
//       "output": "static",
//       "favicon": "./assets/images/favicon.png"
//     },
//     "assetBundlePatterns": ["assets/porcupine/*", "**/*"],
//     "plugins": [
//       "expo-router",
//       [
//         "expo-splash-screen",
//         {
//           "image": "./assets/icons/splash-icon-dark.png",
//           "imageWidth": 200,
//           "resizeMode": "contain",
//           "backgroundColor": "#000000",
//           "dark": {
//             "backgroundColor": "#000000",
//             "image": "./assets/icons/splash-icon-dark.png"
//           },
//           "light": {
//             "backgroundColor": "#FFFFFF",
//             "image": "./assets/icons/splash-icon-light.png"
//         }}
//       ],
//       [
//         "@react-native-voice/voice",
//         {
//           "microphonePermission": "Allow $(PRODUCT_NAME) to access your microphone to detect wake words.",
//           "speechRecognitionPermission": "Allow $(PRODUCT_NAME) to use speech recognition."
//         }
//       ],
//       "expo-secure-store",
//       "expo-video",
//       "expo-audio"
//     ],
//     "experiments": {
//       "typedRoutes": true,
//       "reactCompiler": true
//     },
//     "extra": {
//       "router": {},
//       "eas": {
//         "projectId": "8b58fab1-e9da-4613-9dcd-ba96a30f5826"
//       }
//     }
//   }
// }