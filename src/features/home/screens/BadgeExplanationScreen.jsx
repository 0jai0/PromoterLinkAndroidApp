import React from "react";
import { View, Text, ScrollView, Image, SafeAreaView } from "react-native";
import { 
  badges_01, 
  badges_02, 
  badges_03, 
  badges_04, 
  badges_05, 
  badges_06, 
  badges_07, 
  badges_08 
} from "../../../utils/images";

const BadgeExplanationScreen = () => {
  const badgeLevels = [
    {
      level: "Promoter Rookie",
      count: 1,
      badge: badges_01,
      description: "Kick off your journey! Earn this badge by completing your first promotion."
    },
    {
      level: "Promoter Rising",
      count: 10,
      badge: badges_02,
      description: "You’re getting noticed! Complete 10 promotions to show your activity."
    },
    {
      level: "Promoter Skilled",
      count: 25,
      badge: badges_03,
      description: "Brands value consistency. Achieve 24 promotions to earn this badge."
    },
    {
      level: "Promoter Pro",
      count: 50,
      badge: badges_04,
      description: "Reliability matters! Complete 50 promotions to build strong credibility."
    },
    {
      level: "Promoter Expert",
      count: 100,
      badge: badges_05,
      description: "Brands see you as trustworthy. Unlock this badge after 100 promotions."
    },
    {
      level: "Promoter Elite",
      count: 150,
      badge: badges_06,
      description: "High-value partner! Achieve 150 promotions to join the premium tier."
    },
    {
      level: "Promoter Master",
      count: 250,
      badge: badges_07,
      description: "Top performer! Reach 250 promotions to stand out to leading brands."
    },
    {
      level: "Promoter Legend",
      count: 500,
      badge: badges_08,
      description: "The ultimate achievement! With 500+ promotions, your profile is highly valuable for brands."
    }
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 p-6">
        {/* Header */}
        <View className="mb-8">
          <Text className="text-3xl font-bold text-center text-gray-900 mb-2">
            Promotion Badges
          </Text>
          <Text className="text-lg text-center text-gray-600">
            The more promotions you complete, the more valuable your profile becomes for brands.
          </Text>
        </View>

        {/* Progress Explanation */}
        <View className="bg-white rounded-2xl p-6 shadow-sm mb-8 border border-gray-100">
          <Text className="text-xl font-semibold text-gray-900 mb-3">
            How Badges Work
          </Text>
          <Text className="text-gray-700 mb-4">
            Each badge is unlocked automatically when you reach a promotion milestone. 
            Higher-level badges show your consistency, reliability, and credibility to brands.
          </Text>
          <Text className="text-gray-700">
            Completing more promotions increases your profile value, giving you access to better brand opportunities.
          </Text>
        </View>

        {/* Badge Grid */}
        <View className="mb-8">
          <Text className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Badge Levels
          </Text>
          
          <View className="space-y-6">
            {badgeLevels.map((badge, index) => (
              <View 
                key={index}
                className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100 flex-row items-center"
              >
                {/* Badge Image */}
                <View className="mr-4">
                  <Image 
                    source={badge.badge} 
                    className="w-32 h-32"
                    resizeMode="contain"
                  />
                </View>
                
                {/* Badge Info */}
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-gray-900">
                    {badge.level}
                  </Text>
                  <Text className="text-sm text-blue-600 font-medium mb-1">
                    {badge.count}+ Promotions
                  </Text>
                  <Text className="text-sm text-gray-600">
                    {badge.description}
                  </Text>
                </View>
                
                {/* Level Indicator */}
                <View className="bg-gray-100 rounded-full w-8 h-8 items-center justify-center ml-2">
                  <Text className="text-sm font-bold text-gray-700">
                    {index + 1}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Tips Section */}
        <View className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
          <Text className="text-xl font-semibold text-blue-900 mb-4">
            Tips to Earn More Badges
          </Text>
          <View className="space-y-3">
            <View className="flex-row items-start">
              <View className="bg-blue-100 rounded-full w-6 h-6 items-center justify-center mr-3 mt-1">
                <Text className="text-blue-700 font-bold">1</Text>
              </View>
              <Text className="text-blue-800 flex-1">
                Accept and complete promotions on time to build trust with brands.
              </Text>
            </View>
            <View className="flex-row items-start">
              <View className="bg-blue-100 rounded-full w-6 h-6 items-center justify-center mr-3 mt-1">
                <Text className="text-blue-700 font-bold">2</Text>
              </View>
              <Text className="text-blue-800 flex-1">
                Focus on quality promotions that deliver real value for campaigns.
              </Text>
            </View>
            <View className="flex-row items-start">
              <View className="bg-blue-100 rounded-full w-6 h-6 items-center justify-center mr-3 mt-1">
                <Text className="text-blue-700 font-bold">3</Text>
              </View>
              <Text className="text-blue-800 flex-1">
                Be consistent—completing promotions regularly boosts your visibility.
              </Text>
            </View>
            <View className="flex-row items-start">
              <View className="bg-blue-100 rounded-full w-6 h-6 items-center justify-center mr-3 mt-1">
                <Text className="text-blue-700 font-bold">4</Text>
              </View>
              <Text className="text-blue-800 flex-1">
                Engage positively with brands and audiences to attract more opportunities.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BadgeExplanationScreen;
