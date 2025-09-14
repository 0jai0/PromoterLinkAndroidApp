import React from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";

const Alert = ({ type, message, onClose, onConfirm, onCancel }) => {
  const getBackgroundColor = () => {
    switch (type) {
      case "success": return "bg-green-800";
      case "error": return "bg-red-800";
      case "info": return "bg-blue-800";
      case "warning": return "bg-yellow-800";
      default: return "bg-gray-800";
    }
  };

  const getTextColor = () => {
    switch (type) {
      case "success": return "text-green-200";
      case "error": return "text-red-200";
      case "info": return "text-blue-200";
      case "warning": return "text-yellow-200";
      default: return "text-gray-200";
    }
  };

  return (
    <Modal transparent visible={!!message} animationType="fade">
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className={`${getBackgroundColor()} rounded-lg p-6 w-80`}>
          <Text className={`${getTextColor()} text-lg font-semibold mb-4`}>
            {message}
          </Text>

          <View className="flex-row justify-end space-x-3">
            {onCancel && (
              <TouchableOpacity
                onPress={onCancel}
                className="px-4 py-2 bg-gray-600 rounded"
              >
                <Text className="text-white">Cancel</Text>
              </TouchableOpacity>
            )}

            {onConfirm && (
              <TouchableOpacity
                onPress={onConfirm}
                className="px-4 py-2 bg-[#1FFFE0] rounded"
              >
                <Text className="text-black">Confirm</Text>
              </TouchableOpacity>
            )}

            {/* Always show OK */}
            <TouchableOpacity
              onPress={onClose || (() => {})}
              className="px-4 py-2 bg-[#1FFFE0] rounded"
            >
              <Text className="text-black">OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default Alert;
