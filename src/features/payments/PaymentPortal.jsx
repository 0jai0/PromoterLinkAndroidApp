import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PaymentPortal = ({ setShowPayment }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const targetDate = new Date(currentYear, 11, 1); // December 1st of current year
    
    // If we've passed December 1st this year, target next year
    if (now > targetDate) {
      targetDate.setFullYear(currentYear + 1);
    }
    
    const difference = targetDate - now;
    
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60)
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const isLaunched = timeLeft.days === 0 && timeLeft.hours === 0 && 
                     timeLeft.minutes === 0 && timeLeft.seconds === 0;

  return (
    <View className="flex-1 bg-black/80 justify-center items-center px-4">
      <View className="bg-gradient-to-b from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-8 w-full max-w-md shadow-2xl">
        {/* Header with animated icon */}
        <View className="items-center mb-6">
          <View className="bg-gradient-to-r from-teal-400 to-cyan-500 p-4 rounded-full mb-4 shadow-lg">
            <Ionicons name="rocket" size={42} color="white" />
          </View>
          <Text className="text-white text-2xl font-bold text-center mb-2">
            {isLaunched ? "Premium Features Are Here!" : "Premium Experience Coming Soon"}
          </Text>
          <Text className="text-gray-300 text-center">
            {isLaunched ? "Explore our new paid options" : "Exciting upgrades are on the way!"}
          </Text>
        </View>

        {/* Countdown timer or launch message */}
        {!isLaunched ? (
          <View className="bg-gray-800/50 p-4 rounded-xl mb-6 border border-gray-700">
            <Text className="text-teal-400 text-center text-sm font-medium mb-2">
              Launching on December 1st
            </Text>
            <View className="flex-row justify-center">
              <View className="items-center mx-2">
                <Text className="text-white text-xl font-bold">{String(timeLeft.days).padStart(2, '0')}</Text>
                <Text className="text-gray-400 text-xs">Days</Text>
              </View>
              <Text className="text-teal-400 text-xl font-bold">:</Text>
              <View className="items-center mx-2">
                <Text className="text-white text-xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</Text>
                <Text className="text-gray-400 text-xs">Hours</Text>
              </View>
              <Text className="text-teal-400 text-xl font-bold">:</Text>
              <View className="items-center mx-2">
                <Text className="text-white text-xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</Text>
                <Text className="text-gray-400 text-xs">Mins</Text>
              </View>
              <Text className="text-teal-400 text-xl font-bold">:</Text>
              <View className="items-center mx-2">
                <Text className="text-white text-xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</Text>
                <Text className="text-gray-400 text-xs">Secs</Text>
              </View>
            </View>
          </View>
        ) : (
          <View className="bg-teal-900/20 p-4 rounded-xl mb-6 border border-teal-800/30">
            <Text className="text-teal-300 text-center font-medium">
              Our premium features are now available! Check out our new coin packages.
            </Text>
          </View>
        )}

        {/* Progress bar */}
        <View className="mb-6">
          <View className="flex-row justify-between mb-2">
            <Text className="text-teal-400 text-sm">Development Progress</Text>
            <Text className="text-gray-400 text-sm">{isLaunched ? '100%' : '75%'}</Text>
          </View>
          <View className="bg-gray-700 rounded-full h-3">
            <View 
              className="bg-gradient-to-r from-teal-400 to-cyan-500 rounded-full h-3 shadow-md" 
              style={{ width: isLaunched ? '100%' : '75%' }}
            ></View>
          </View>
        </View>

        {/* Feature cards grid */}
        <View className="mb-6">
          <Text className="text-white font-semibold mb-3">What's {isLaunched ? 'Here' : 'Coming'}:</Text>
          <View className="flex-row flex-wrap justify-between">
            <View className="bg-gray-800 p-3 rounded-lg mb-3 w-[48%] border border-gray-700">
              <View className="flex-row items-center">
                <Ionicons name="add-circle" size={20} color="#22d3ee" />
                <Text className="text-white ml-2 text-sm">Coin Packages</Text>
              </View>
            </View>
            <View className="bg-gray-800 p-3 rounded-lg mb-3 w-[48%] border border-gray-700">
              <View className="flex-row items-center">
                <Ionicons name="diamond" size={20} color="#22d3ee" />
                <Text className="text-white ml-2 text-sm">Exclusive Content</Text>
              </View>
            </View>
            <View className="bg-gray-800 p-3 rounded-lg mb-3 w-[48%] border border-gray-700">
              <View className="flex-row items-center">
                <Ionicons name="flash" size={20} color="#22d3ee" />
                <Text className="text-white ml-2 text-sm">Premium Features</Text>
              </View>
            </View>
            <View className="bg-gray-800 p-3 rounded-lg mb-3 w-[48%] border border-gray-700">
              <View className="flex-row items-center">
                <Ionicons name="gift" size={20} color="#22d3ee" />
                <Text className="text-white ml-2 text-sm">Special Rewards</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Message */}
        <View className="bg-teal-900/20 p-4 rounded-xl mb-6 border border-teal-800/30">
          <Text className="text-teal-300 text-center italic">
            {isLaunched 
              ? "Thank you for your patience! Our premium features are now available."
              : "Enjoy our free services while we craft an exceptional premium experience just for you!"
            }
          </Text>
        </View>

        {/* Action buttons */}
        <View className="flex-row justify-between space-x-3">
          <TouchableOpacity
            onPress={() => setShowPayment(false)}
            className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-600 px-6 py-4 rounded-xl flex-row justify-center items-center shadow-lg"
            activeOpacity={0.8}
          >
            <Ionicons name="play" size={20} color="white" />
            <Text className="text-white font-bold ml-2">
              {isLaunched ? "Explore Now" : "Continue Free"}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => {/* Add notify me function */}}
            className="flex-1 bg-gray-700 px-4 py-4 rounded-xl flex-row justify-center items-center border border-gray-600"
            activeOpacity={0.8}
          >
            <Ionicons name="notifications" size={20} color="#22d3ee" />
            <Text className="text-cyan-400 ml-2 text-sm">Notify Me</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View className="flex-row justify-center mt-5">
          <Ionicons name="heart" size={14} color="#22d3ee" />
          <Text className="text-gray-500 text-xs ml-1">
            Thank you for your patience!
          </Text>
        </View>
      </View>
    </View>
  );
};

export default PaymentPortal;