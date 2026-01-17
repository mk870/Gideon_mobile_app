import "dotenv/config";

export default {
  expo: {
    name: "Gideon",
    slug: "gideon",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "gideon",
    userInterfaceStyle: "dark",
    backgroundColor: "#000000",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      userInterfaceStyle: "dark",
      backgroundColor: "#000000",
      infoPlist: {
        NSMicrophoneUsageDescription:
          "This app needs microphone access to detect the wake word 'Gideon'",
        NSSpeechRecognitionUsageDescription:
          "This app needs speech recognition to detect the wake word 'Gideon'",
          UIBackgroundModes: [
          "audio"
        ]
      },
      icon: {
        dark: "./assets/icons/ios-dark.png",
        light: "./assets/icons/ios-light.png",
        tinted: "./assets/icons/ios-tinted.png",
      },
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#FFFFFF",
        foregroundImage: "./assets/icons/adaptive-icon.png",
        monochromeImage: "./assets/icons/adaptive-icon.png",
      },
      userInterfaceStyle: "dark",
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      permissions: ["RECORD_AUDIO"],
      package: "com.anonymous.gideon",
    },
    web: {
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    assetBundlePatterns: ["assets/porcupine/*", "**/*"],
    plugins: [
      "expo-router",
      "expo-web-browser",
      "expo-asset",
      "@config-plugins/react-native-webrtc",
      [
        "expo-splash-screen",
        {
          image: "./assets/icons/splash-icon-dark.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#000000",
          dark: {
            backgroundColor: "#000000",
            image: "./assets/icons/splash-icon-dark.png",
          },
          light: {
            backgroundColor: "#FFFFFF",
            image: "./assets/icons/splash-icon-light.png",
          },
        },
      ],
      "expo-secure-store",
      "expo-video",
      "expo-audio",
      [
        "expo-build-properties",
        {
          android: {
            useAndroidX: true,
            enableJetifier: true,
            compileSdkVersion: 36,
            targetSdkVersion: 36, 
            buildToolsVersion: "36.0.0",
          },
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
    extra: {
      porcupineAccessKey: process.env.PORCUPINE_ACCESS_KEY,
      router: {},
      eas: {
        projectId: "8b58fab1-e9da-4613-9dcd-ba96a30f5826",
      },
    },
  },
};
