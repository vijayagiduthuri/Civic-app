import { Ionicons } from "@expo/vector-icons";
import { JSX } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { AppRoutes } from "../app/routes"; // import your type

type MenuModalProps = {
  visible: boolean;
  onClose: () => void;
  onNavigate: (screen: AppRoutes) => void; // ✅ use AppRoutes
};

// Menu Modal Component
export const MenuModal = ({ visible, onClose, onNavigate }: MenuModalProps): JSX.Element => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        className="flex-1 bg-white bg-opacity-50"
        activeOpacity={1}
        onPress={onClose}
      >
        <View
          className="absolute top-16 right-4 bg-white rounded-2xl py-2 min-w-[150px]"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
            elevation: 8,
          }}
        >
          <TouchableOpacity
            className="flex-row items-center px-4 py-3"
            onPress={() => onNavigate("/(tabs)/Sidebar")} // must be AppRoutes
          >
            <Ionicons name="person-outline" size={20} color="#374151" />
            <Text className="text-gray-700 font-medium ml-3">Profile</Text>
          </TouchableOpacity>

          <View className="h-px bg-gray-100 mx-4"></View>

          <TouchableOpacity
            className="flex-row items-center px-4 py-3"
            onPress={() => onNavigate("/signin")} // must be AppRoutes
          >
            <Ionicons name="settings-outline" size={20} color="#374151" />
            <Text className="text-gray-700 font-medium ml-3">Settings</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};
