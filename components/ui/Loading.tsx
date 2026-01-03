import { LoadingProps } from "@/type";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

const Loading: React.FC<LoadingProps> = ({
  dotSize = 10,
  dotColor = "#282828",
  dotSpacing = 8,
  duration = 600,
  style,
}) => {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = (dot: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: 1,
            duration: duration,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: duration,
            useNativeDriver: true,
          }),
        ])
      );
    };

    const animation1 = animate(dot1, 0);
    const animation2 = animate(dot2, duration / 3);
    const animation3 = animate(dot3, (duration * 2) / 3);

    animation1.start();
    animation2.start();
    animation3.start();

    return () => {
      animation1.stop();
      animation2.stop();
      animation3.stop();
    };
  }, [dot1, dot2, dot3, duration]);

  return (
    <View style={[styles.container, style]}>
      <Animated.View
        style={[
          styles.dot,
          {
            width: dotSize,
            height: dotSize,
            backgroundColor: dotColor,
            marginHorizontal: dotSpacing / 2,
            opacity: dot1,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.dot,
          {
            width: dotSize,
            height: dotSize,
            backgroundColor: dotColor,
            marginHorizontal: dotSpacing / 2,
            opacity: dot2,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.dot,
          {
            width: dotSize,
            height: dotSize,
            backgroundColor: dotColor,
            marginHorizontal: dotSpacing / 2,
            opacity: dot3,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    borderRadius: 999,
  },
});

export default Loading;
