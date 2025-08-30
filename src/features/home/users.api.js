import API from "../../api/config";

export const fetchUsers = async (filters) => {
  const {
    page = 1,
    limit = 10,
    searchTerm = "",
    selectedAdCategories = [],
    selectedPlatforms = [],
    selectedAudienceTypes = [],
    selectedLocations = [],
    minFollowers = "",
    maxFollowers = ""
  } = filters;

  const params = new URLSearchParams();
  params.append('page', page);
  params.append('limit', limit);

  if (searchTerm) params.append('search', searchTerm);
  if (selectedAdCategories.length > 0) params.append('adCategories', selectedAdCategories.join(','));
  if (selectedPlatforms.length > 0) params.append('socialMediaPlatforms', selectedPlatforms.join(','));
  if (selectedAudienceTypes.length > 0) params.append('averageAudienceType', selectedAudienceTypes.join(','));
  if (selectedLocations.length > 0) params.append('averageLocationOfAudience', selectedLocations.join(','));
  if (minFollowers) params.append('minFollowers', minFollowers);
  if (maxFollowers) params.append('maxFollowers', maxFollowers);

  //console.log("Fetching users with params:", Object.fromEntries(params));

  try {
    const response = await API.get(`/api/pageowners/users?${params.toString()}`);
    // console.log("Users response:", response.data);
    return response.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
};