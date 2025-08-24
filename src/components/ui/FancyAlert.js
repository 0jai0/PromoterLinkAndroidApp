import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const FancyAlert = ({ 
  visible, 
  type = 'info', 
  title, 
  message, 
  onClose, 
  duration = 4000,
  position = 'top'
}) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(position === 'top' ? -100 : 100));

  useEffect(() => {
    if (visible) {
      // Animate in
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          easing: Easing.out(Easing.back(1.2)),
          useNativeDriver: true,
        })
      ]).start();

      // Auto close after duration
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: position === 'top' ? -100 : 100,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start(() => {
      onClose && onClose();
    });
  };

  const getIconAndColor = () => {
    switch (type) {
      case 'error':
        return { 
          icon: 'close-circle', 
          color: '#EF4444', 
          bgColor: '#FEF2F2',
          iconColor: '#DC2626'
        };
      case 'success':
        return { 
          icon: 'checkmark-circle', 
          color: '#10B981', 
          bgColor: '#ECFDF5',
          iconColor: '#059669'
        };
      case 'warning':
        return { 
          icon: 'warning', 
          color: '#F59E0B', 
          bgColor: '#FFFBEB',
          iconColor: '#D97706'
        };
      case 'info':
        return { 
          icon: 'information-circle', 
          color: '#3B82F6', 
          bgColor: '#EFF6FF',
          iconColor: '#2563EB'
        };
      default:
        return { 
          icon: 'information-circle', 
          color: '#3B82F6', 
          bgColor: '#EFF6FF',
          iconColor: '#2563EB'
        };
    }
  };

  const { icon, color, bgColor, iconColor } = getIconAndColor();

  if (!visible) return null;

  return (
    <Animated.View 
      style={{
        position: 'absolute',
        top: position === 'top' ? 50 : undefined,
        bottom: position === 'bottom' ? 50 : undefined,
        left: 20,
        right: 20,
        backgroundColor: bgColor,
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 5,
        zIndex: 1000,
        transform: [{ translateY: slideAnim }],
        opacity: fadeAnim,
        borderLeftWidth: 4,
        borderLeftColor: color,
      }}
    >
      <Ionicons name={icon} size={24} color={iconColor} style={{ marginRight: 12 }} />
      <View style={{ flex: 1 }}>
        {title && (
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#1F2937', marginBottom: 4 }}>
            {title}
          </Text>
        )}
        <Text style={{ fontSize: 14, color: '#6B7280' }}>
          {message}
        </Text>
      </View>
      <TouchableOpacity 
        onPress={handleClose} 
        style={{ padding: 4, marginLeft: 8 }}
        hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
      >
        <Ionicons name="close" size={20} color="#9CA3AF" />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default FancyAlert;