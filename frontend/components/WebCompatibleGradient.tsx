import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ColorValue, Platform, View, ViewStyle } from 'react-native';

interface WebGradientProps {
  colors: readonly [ColorValue, ColorValue, ...ColorValue[]];
  style?: ViewStyle;
  children?: React.ReactNode;
  start?: { x: number; y: number };
  end?: { x: number; y: number };
}

export const WebCompatibleGradient: React.FC<WebGradientProps> = ({ 
  colors, 
  style, 
  children, 
  start = { x: 0, y: 0 }, 
  end = { x: 1, y: 1 } 
}) => {
  if (Platform.OS === 'web') {
    // Create CSS gradient for web
    const angle = Math.atan2(end.y - start.y, end.x - start.x) * 180 / Math.PI + 90;
    const gradient = `linear-gradient(${angle}deg, ${colors.join(', ')})`;
    
    return (
      <View 
        style={[
          style,
          { background: gradient } as any
        ]}
      >
        {children}
      </View>
    );
  }
  
  // Use LinearGradient for native
  return (
    <LinearGradient colors={colors} style={style} start={start} end={end}>
      {children}
    </LinearGradient>
  );
};
