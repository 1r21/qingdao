import React, { useRef, useEffect } from 'react';
import { Animated, Easing } from 'react-native';

import Icon from './Icon';

const MAX_TIMES = 500;

const Loading = props => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const AnimTiming = Animated.timing(rotateAnim, {
      toValue: 360 * MAX_TIMES,
      duration: 1000 * MAX_TIMES,
      easing: Easing.linear,
      useNativeDriver: false,
    });
    AnimTiming.start();
    return () => AnimTiming.stop();
  }, [rotateAnim]);

  return (
    <Animated.Text
      style={{
        ...props.style,
        transform: [
          {
            rotate: rotateAnim.interpolate({
              inputRange: [0, 360],
              outputRange: ['0deg', '360deg'],
            }),
          },
          { perspective: 1000 },
        ],
      }}>
      <Icon name="loading" size={50} color="#FFD479" />
    </Animated.Text>
  );
};

export default Loading;
