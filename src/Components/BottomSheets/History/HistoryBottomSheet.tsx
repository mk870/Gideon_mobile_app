import { useBottomSheetsContext } from "@/src/Context/BottomSheetsContext";
import React, { useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSharedValue, withSpring } from "react-native-reanimated";

type Props = {};

const HistoryBottomSheet = (props: Props) => {
  const historyOptions = [
    {
      name: "Search History",
      icon: "history",
    },
    {
      name: "Chat History",
      icon: "chat",
    },
    {
      name: "Latest Chat History",
      icon: "image",
    },
  ];
  const translateY = useSharedValue(1);
  const initialBottomSheetHeight = -160;
  const { setIsHistoryBottomSheetOpen } = useBottomSheetsContext();

  const scrollTo = useCallback((destination: number) => {
    "worklet";
    translateY.value = withSpring(destination, { damping: 50 });
  }, []);

  const closeBottomSheetWithoutScrollingToTheBottom = () => {
    scrollTo(0);
    setTimeout(() => {
      setIsHistoryBottomSheetOpen(false);
    }, 300);
  };
  return (
    <View>
      <Text>HistoryBottomSheet</Text>
    </View>
  );
};

export default HistoryBottomSheet;

const styles = StyleSheet.create({});
