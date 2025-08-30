import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  ScrollView,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  RefreshControl,
  Modal,
  Dimensions,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { useUsers } from "../hooks/useUsers";
import { useContacts } from "../hooks/useContacts";
import Alert from "../components/Alert/Alert";
import SearchBar from "../components/Filters/SearchBar";
import CategoryFilter from "../components/Filters/CategoryFilter";
import AdvancedFilters from "../components/Filters/AdvancedFilters";
import UserCard from "../components/UserCard/UserCard";
import Pagination from "../components/Pagination/Pagination";
import { handleAddToList, handleChatNow } from "../utils/handlers";
import { checkAuth } from "../../auth/authSlice";
import Header from "../components/Header/Header";
import AppLayout from "../../../components/layout/AppLayout";
import { Ionicons } from "@expo/vector-icons";
import Profile from "./Profile";
import { coin_logo } from "../../../utils/images";
import Draggable from "react-native-draggable";

const HomeScreen = ({ navigation }) => {
  //console.log("Navigation in HomeScreen:", navigation);
  const dispatch = useDispatch();
  const screenHeight = Dimensions.get("window").height;

  // Get auth state from Redux
  const {
    user,
    isAuthenticated,
    loading: authLoading,
  } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState("");
  const [alert, setAlert] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  // Filter states
  const [selectedAdCategories, setSelectedAdCategories] = useState([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [selectedAudienceTypes, setSelectedAudienceTypes] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [minFollowers, setMinFollowers] = useState("");
  const [maxFollowers, setMaxFollowers] = useState("");

  // Check authentication on component mount
  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(checkAuth());
    }
  }, [dispatch, isAuthenticated]);

  // Memoize filters to prevent unnecessary re-renders
  const filters = useMemo(
    () => ({
      searchTerm,
      selectedAdCategories,
      selectedPlatforms,
      selectedAudienceTypes,
      selectedLocations,
      minFollowers,
      maxFollowers,
    }),
    [
      searchTerm,
      selectedAdCategories,
      selectedPlatforms,
      selectedAudienceTypes,
      selectedLocations,
      minFollowers,
      maxFollowers,
    ]
  );

  const {
    users,
    isLoading,
    error,
    page,
    totalPages,
    goToPage,
    refetch,
    hasFetched,
  } = useUsers(filters);
  const { contacts, refetch: refetchContacts } = useContacts(user?._id);

  const handleSearch = (text) => {
    setSearchTerm(text);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    if (user?._id) {
      await refetchContacts();
    }
    setRefreshing(false);
  };

  const retryFetch = () => {
    refetch();
    if (user?._id) {
      refetchContacts();
    }
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedAdCategories([]);
    setSelectedPlatforms([]);
    setSelectedAudienceTypes([]);
    setSelectedLocations([]);
    setMinFollowers("");
    setMaxFollowers("");
    setShowMoreFilters(false);
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setProfileModalVisible(true);
  };

  const closeProfileModal = () => {
    setProfileModalVisible(false);
    setSelectedUser(null);
  };

  const hasActiveFilters =
    searchTerm ||
    selectedAdCategories.length > 0 ||
    selectedPlatforms.length > 0 ||
    selectedAudienceTypes.length > 0 ||
    selectedLocations.length > 0 ||
    minFollowers ||
    maxFollowers;

  // Show login prompt if not authenticated
  if (authLoading) {
    return (
      <View className="flex-1 bg-slate-50 justify-center items-center">
        <View className="items-center">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="text-slate-500 mt-4 text-base">
            Checking authentication...
          </Text>
        </View>
      </View>
    );
  }

  if (!isAuthenticated) {
    return (
      <View className="flex-1 bg-slate-50 justify-center items-center p-8">
        <View className="bg-white p-8 rounded-2xl w-full max-w-md shadow-sm border border-slate-200">
          <View className="items-center mb-6">
            <View className="bg-blue-50 p-4 rounded-full">
              <Ionicons
                name="person-circle-outline"
                size={48}
                color="#3B82F6"
              />
            </View>
          </View>
          <Text className="text-slate-800 text-xl font-bold mb-4 text-center">
            Authentication Required
          </Text>
          <Text className="text-slate-600 text-center mb-8 text-base">
            Please log in to view influencers and manage your contacts
          </Text>
          <TouchableOpacity
            className="bg-blue-600 px-6 py-4 rounded-xl flex-row justify-center items-center shadow-sm"
            onPress={() => navigation.navigate("Login")}
          >
            <Ionicons name="log-in" size={20} color="white" />
            <Text className="text-white font-semibold ml-2 text-base">
              Go to Login
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <AppLayout>
      <View className="flex-1 bg-slate-50">
        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={alert.onClose}
            onConfirm={alert.onConfirm}
            onCancel={alert.onCancel}
          />
        )}

        <View className="pt-5 p-4 bg-slate-50 flex-1">
          {/* Header */}
          <Header user={user} navigation={navigation} />

          {/* Search and Filters Section */}
          <View className="mb-4">
            <SearchBar searchTerm={searchTerm} onSearch={handleSearch} />

            <View className="flex-row items-center justify-between mt-4">
              <CategoryFilter
                selectedAdCategories={selectedAdCategories}
                onCategoryChange={setSelectedAdCategories}
              />

              <TouchableOpacity
                className="px-4 py-3 bg-white rounded-xl flex-row items-center border border-slate-200 shadow-xs"
                onPress={() => setShowMoreFilters(!showMoreFilters)}
              >
                <Ionicons
                  name={showMoreFilters ? "filter" : "filter-outline"}
                  size={18}
                  color="#64748B"
                />
                <Text className="text-slate-700 ml-2 text-sm font-medium">
                  {showMoreFilters ? "Hide Filters" : "More Filters"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Active filters indicator */}
            {hasActiveFilters && (
              <View className="flex-row items-center justify-between mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <View className="flex-row items-center">
                  <Ionicons name="funnel" size={16} color="#3B82F6" />
                  <Text className="text-slate-700 ml-2 text-sm font-medium">
                    Filters active
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={clearAllFilters}
                  className="bg-white px-3 py-1.5 rounded-lg flex-row items-center border border-slate-200 shadow-xs"
                >
                  <Ionicons name="close" size={14} color="#64748B" />
                  <Text className="text-slate-700 text-xs ml-1 font-medium">
                    Clear all
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <AdvancedFilters
            showMoreFilters={showMoreFilters}
            setShowMoreFilters={setShowMoreFilters}
            selectedPlatforms={selectedPlatforms}
            setSelectedPlatforms={setSelectedPlatforms}
            selectedAudienceTypes={selectedAudienceTypes}
            setSelectedAudienceTypes={setSelectedAudienceTypes}
            selectedLocations={selectedLocations}
            setSelectedLocations={setSelectedLocations}
            minFollowers={minFollowers}
            setMinFollowers={setMinFollowers}
            maxFollowers={maxFollowers}
            setMaxFollowers={setMaxFollowers}
          />

          {/* Error State */}
          {error && (
            <View className="bg-red-50 p-4 rounded-xl mb-4 border border-red-100">
              <View className="flex-row items-center mb-2">
                <Ionicons name="warning" size={20} color="#EF4444" />
                <Text className="text-red-800 ml-2 font-medium">
                  Error Loading Data
                </Text>
              </View>
              <Text className="text-red-700 mb-4 text-sm">{error}</Text>
              <TouchableOpacity
                onPress={retryFetch}
                className="bg-red-600 py-3 px-4 rounded-xl flex-row justify-center items-center shadow-xs"
              >
                <Ionicons name="refresh" size={16} color="white" />
                <Text className="text-white ml-2 font-medium">Retry</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Results Header */}
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-slate-800 text-lg font-semibold">
              {isLoading
                ? "Searching..."
                : users.length > 0
                  ? "Influencers"
                  : "No Results"}
            </Text>
            {users.length > 0 && (
              <Text className="text-slate-500 text-sm">
                Page {page} of {totalPages}
              </Text>
            )}
          </View>

          {/* Users List */}
          <ScrollView
            className="flex-1"
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={["#3B82F6"]}
                tintColor="#3B82F6"
              />
            }
          >
            {isLoading && !hasFetched ? (
              <View className="flex-1 justify-center items-center py-12">
                <ActivityIndicator size="large" color="#3B82F6" />
                <Text className="text-slate-500 mt-4 text-base">
                  Loading influencers...
                </Text>
              </View>
            ) : users.length === 0 && hasFetched ? (
              <View className="py-12 items-center bg-white rounded-xl p-6 mt-2 border border-slate-200 shadow-xs">
                <View className="bg-slate-100 p-4 rounded-full mb-4">
                  <Ionicons name="search" size={36} color="#64748B" />
                </View>
                <Text className="text-slate-800 mt-4 text-lg font-medium">
                  No influencers found
                </Text>
                <Text className="text-slate-500 text-center mt-2 text-sm">
                  Try adjusting your search criteria or filters to find more
                  results
                </Text>
                {hasActiveFilters && (
                  <TouchableOpacity
                    onPress={clearAllFilters}
                    className="mt-4 bg-blue-600 px-5 py-3 rounded-xl flex-row items-center shadow-xs"
                  >
                    <Ionicons name="close-circle" size={18} color="white" />
                    <Text className="text-white ml-2 font-medium">
                      Clear all filters
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <>
                <View className="space-y-3 mb-4">
                  {users.map((userItem) => (
                    <UserCard
                      key={userItem._id}
                      user={userItem}
                      contacts={contacts}
                      onSelect={handleUserSelect}
                      onAddToList={(targetUser) =>
                        handleAddToList(
                          targetUser,
                          user,
                          contacts,
                          setAlert,
                          refetchContacts,
                          refetch
                        )
                      }
                      onChatNow={(targetUser) =>
                        handleChatNow(
                          targetUser,
                          user,
                          contacts,
                          navigation,
                          setAlert,
                          refetchContacts,
                          refetch
                        )
                      }
                    />
                  ))}
                </View>

                {users.length > 0 && (
                  <Pagination
                    page={page}
                    totalPages={totalPages}
                    user={user}
                    isAuthenticated={isAuthenticated}
                    onPageChange={goToPage}
                    navigation={navigation}
                  />
                )}
              </>
            )}
          </ScrollView>
        </View>

        
            {user && (
              <Draggable
                x={10} // initial x position
                y={700} // initial y position
                minX={20}
                minY={100}
                onDrag={() => {}}
              >
                <TouchableOpacity
                  onPress={() => setShowPayment(true)}
                  className="bg-[#202020] rounded-full px-3 py-2 flex-row items-center border border-[#1FFFE0]/30 shadow-md"
                >
                  <Image
                    source={coin_logo}
                    className="w-8 h-8"
                    resizeMode="contain"
                  />
                  <Text className="text-white font-bold ml-2">
                    {user.linkCoins}
                  </Text>
                  <Text className="text-white ml-1">LinkCoins</Text>
                </TouchableOpacity>
              </Draggable>
            )}

            {/* Payment Modal */}
            <Modal
              visible={showPayment}
              transparent
              animationType="fade"
              onRequestClose={() => setShowPayment(false)}
            >
              <View className="flex-1 bg-black/70 justify-center items-center">
                <View className="bg-[#202020] border border-gray-700 rounded-xl p-6 w-80">
                  <Text className="text-white text-lg mb-4">
                    Payment Screen
                  </Text>
                  <TouchableOpacity
                    onPress={() => setShowPayment(false)}
                    className="bg-[#1FFFE0] px-4 py-2 rounded-md"
                  >
                    <Text className="text-black font-bold">Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

        {/* Full Screen Profile Modal */}
        <Modal
          visible={profileModalVisible}
          animationType="slide"
          transparent={false}
          statusBarTranslucent={true}
          onRequestClose={closeProfileModal}
        >
          <View className="flex-1 bg-white">
            {/* Close button */}
            <TouchableOpacity
              onPress={closeProfileModal}
              className="absolute top-2 right-4 z-50 bg-white rounded-full p-2 shadow-md"
              style={{ marginTop: 30 }}
            >
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>

            {/* Profile Component */}
            {selectedUser && <Profile user={selectedUser} />}
          </View>
        </Modal>
      </View>
    </AppLayout>
  );
};

export default HomeScreen;
