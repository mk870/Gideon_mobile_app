import {
    AudioModule,
    RecordingPresets,
    setAudioModeAsync,
    useAudioRecorder,
    useAudioRecorderState
} from 'expo-audio';
import React, { useEffect } from 'react';
import { Alert, Text, View } from 'react-native';

type Props = {
    url: string;
  onTextMessage?: (message: string) => void;
  onError?: (error: Error) => void;
}

const useWebSocketConn = ({
  url,
  onTextMessage,
  onError,
}: Props) => {
   const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(audioRecorder);

  const record = async () => {
    await audioRecorder.prepareToRecordAsync();
    audioRecorder.record();
  };

  const stopRecording = async () => {
    // The recording will be available on `audioRecorder.uri`.
    await audioRecorder.stop();
  };

  useEffect(() => {
    (async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        Alert.alert('Permission to access microphone was denied');
      }

      setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: true,
      });
    })();
  }, []);
  
  return (
    <View>
      <Text>useWebSocketConn</Text>
    </View>
  )
}

export default useWebSocketConn