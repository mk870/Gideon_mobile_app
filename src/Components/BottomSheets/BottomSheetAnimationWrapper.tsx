/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
    runOnJS,
    SharedValue,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
} from "react-native-reanimated";

import { IVoidFunc } from "@/src/GlobalTypes/Types";
import { colorScheme, gray } from "@/src/Theme/Colors";

type Props = {
  initialBottomSheetHeight: number;
  children: React.ReactElement;
  translateY: SharedValue<number>;
  scrollTo: (destination: number) => void;
  closeBottomSheet: IVoidFunc;
  closeBottomSheetWithoutScrollingToTheBottom: IVoidFunc;
};

const BottomSheetAnimationWrapper: React.FC<Props> = ({
  initialBottomSheetHeight,
  children,
  translateY,
  scrollTo,
  closeBottomSheet,
  closeBottomSheetWithoutScrollingToTheBottom,
}) => {
  const bottomSheetHeight = useSharedValue(initialBottomSheetHeight);
  const { height } = useWindowDimensions();
  const derivedHeight = useDerivedValue(() => {
    return initialBottomSheetHeight;
  });

  const context = useSharedValue({ y: 0 });
  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { y: translateY.value };
    })
    .onUpdate((event) => {
      translateY.value = event.translationY + context.value.y;
      translateY.value = Math.max(translateY.value, derivedHeight.value);
    })
    .onEnd(() => {
      if (translateY.value > derivedHeight.value / 2) {
        scrollTo(0);
        runOnJS(closeBottomSheet)();
      } else scrollTo(derivedHeight.value);
    });

  useEffect(() => {
    scrollTo(derivedHeight.value);
  }, []);

  const transformStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: "#1b1b1cb3",
        },
      ]}
      onTouchEnd={closeBottomSheetWithoutScrollingToTheBottom}
    >
      <GestureDetector gesture={gesture}>
        <Animated.View
          style={[
            styles.bottomSheet,
            transformStyle,
            {
              backgroundColor: colorScheme.background,
              top: height,
              height: height,
            },
          ]}
          onStartShouldSetResponder={(event) => true}
          onTouchEnd={(e) => {
            e.stopPropagation();
          }}
        >
          <View style={styles.sheetHeader}>
            <View
              style={[
                styles.dragHandle,
                {
                  backgroundColor: gray,
                },
              ]}
            />
          </View>
          {children}
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

export default BottomSheetAnimationWrapper;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  bottomSheet: {
    position: "absolute",
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    padding: 5,
  },
  sheetHeader: {
    alignItems: "center",
  },
  dragHandle: {
    width: 40,
    height: 5,
    borderRadius: 2.5,
    marginVertical: 10,
  },
  sheetContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
