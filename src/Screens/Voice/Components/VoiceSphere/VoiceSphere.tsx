import React, { useEffect } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import Animated, {
    Easing,
    cancelAnimation,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming
} from 'react-native-reanimated';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

const { width } = Dimensions.get('window');
const SIZE = width * 0.6; // The overall size of the animation container
const STROKE_WIDTH = 15; // Thickness of the glowing ring
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// --- Configuration ---
// Colors to achieve the neon look
const BRIGHT_CYAN = '#00F7FF';
const DEEP_BLUE = '#0066FF';

// Animation Durations (ms) - Lower is faster
const SLOW_SPEED = 4000; // Listening time for full rotation
const FAST_SPEED = 1000; // Speaking time for full rotation

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

type VoiceProps = {
  isSpeaking: boolean;
};

export const NeonRing: React.FC<VoiceProps> = ({ isSpeaking }) => {
  const rotationMain = useSharedValue(0);
  const rotationParticles = useSharedValue(0);
  const pulseScale = useSharedValue(1);

  const speed = isSpeaking ? FAST_SPEED : SLOW_SPEED;

  useEffect(() => {
    // 1. Main Ring Rotation (Continuous spin)
    rotationMain.value = withRepeat(
      withTiming(360, {
        duration: speed,
        easing: Easing.linear,
      }),
      -1 // Infinite
    );

    // 2. "Particle" Ring Rotation (Spins slightly faster for effect)
    rotationParticles.value = withRepeat(
      withTiming(360, {
        duration: speed * 0.8, // Slightly faster than main ring
        easing: Easing.linear,
      }),
      -1
    );

    // 3. Subtle Pulsing effect (Heartbeat)
    pulseScale.value = withRepeat(
      withTiming(1.05, {
        duration: isSpeaking ? 500 : 1500,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true // Reverse animation back to 1
    );

    return () => {
      cancelAnimation(rotationMain);
      cancelAnimation(rotationParticles);
      cancelAnimation(pulseScale);
    };
  }, [isSpeaking, speed]);

  // Animated styles for rotation
  const mainContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotateZ: `${rotationMain.value}deg` }],
    };
  });

  const particleContainerStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      transform: [{ rotateZ: `${rotationParticles.value}deg` }],
    };
  });

  // Animated style for the overall pulsing scale
  const wrapperStyle = useAnimatedStyle(() => {
      return {
          transform: [{ scale: pulseScale.value }]
      }
  })

  return (
    <Animated.View style={[styles.ringWrapper, wrapperStyle]}>
      <Svg height={SIZE} width={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        <Defs>
          {/* Create the Neon Gradient */}
          <LinearGradient id="neonGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor={DEEP_BLUE} stopOpacity="0.5" />
            <Stop offset="50%" stopColor={BRIGHT_CYAN} stopOpacity="1" />
            <Stop offset="100%" stopColor={DEEP_BLUE} stopOpacity="0.5" />
          </LinearGradient>
        </Defs>

        {/* Layer 1: The Main Glowing Ring */}
        <Animated.View style={[styles.svgContainer, mainContainerStyle]}>
         <Svg height={SIZE} width={SIZE}>
            <Circle
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={RADIUS}
                stroke="url(#neonGrad)" // Apply the gradient
                strokeWidth={STROKE_WIDTH}
                strokeLinecap="round"
                fill="transparent"
                // We use strokeDasharray to make part of the circle transparent
                // creating a "tail" effect as it spins
                strokeDasharray={`${CIRCUMFERENCE * 0.75} ${CIRCUMFERENCE * 0.25}`}
                strokeDashoffset={0}
            />
         </Svg>
        </Animated.View>

        {/* Layer 2: The "Particle" effect layer */}
        {/* This is a thinner, dashed ring spinning at a different speed */}
        <Animated.View style={[styles.svgContainer, particleContainerStyle]}>
             <Svg height={SIZE} width={SIZE}>
                <Circle
                    cx={SIZE / 2}
                    cy={SIZE / 2}
                    r={RADIUS + 2} // Slightly larger radius
                    stroke={BRIGHT_CYAN}
                    strokeWidth={2} // Thin lines
                    fill="transparent"
                    // Short dashes to simulate particles
                    strokeDasharray="4 10" 
                    opacity={0.6}
                />
            </Svg>
        </Animated.View>

        {/* Optional: Center Core */}
        <Circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS * 0.8} fill="#000814" opacity={0.5} />

      </Svg>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#000814', // Very dark blue/black background defines the neon look
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingVertical: 50,
  },
  title: {
    color: BRIGHT_CYAN,
    fontSize: 24,
    fontWeight: '300',
    letterSpacing: 1,
  },
  visualizerContainer: {
    width: SIZE,
    height: SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    // Adding a subtle outer glow shadow to the whole container
    shadowColor: BRIGHT_CYAN,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  ringWrapper: {
      width: SIZE,
      height: SIZE,
      justifyContent: 'center',
      alignItems: 'center',
  },
  svgContainer: {
    position: 'absolute',
    width: SIZE,
    height: SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    backgroundColor: 'transparent',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: DEEP_BLUE,
  },
  buttonActive: {
    borderColor: BRIGHT_CYAN,
    backgroundColor: 'rgba(0, 247, 255, 0.1)',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});