import { addToContacts } from "../contancts.api";

export const handleAddToList = async (
  targetUser,
  currentUser,
  contacts,
  setAlert,
  fetchContacts,
  fetchUsers
) => {
  if (!currentUser?._id || !targetUser?._id) {
    console.error("Both User ID and Target User ID are required");
    setAlert({ type: 'error', message: 'User information is missing' });
    return;
  }

  const isAlreadyInContacts = contacts.some(contact => contact.user?._id === targetUser._id);
  if (isAlreadyInContacts) {
    setAlert({ type: 'info', message: 'This user is already in your list.' });
    return;
  }

  if (currentUser.linkCoins < 1) {
    setAlert({ type: 'error', message: 'Insufficient LinkCoins. Please purchase more.' });
    return;
  }

  setAlert({
    type: 'confirm',
    message: 'Spend 1 LinkCoin to add this user to your list. Are you sure?',
    onConfirm: async () => {
      try {
        await addToContacts(currentUser.id, targetUser._id);
        setAlert({ type: 'success', message: 'User added to collection successfully!' });
        
        // Refresh data
        if (fetchContacts) await fetchContacts();
        if (fetchUsers) await fetchUsers();
      } catch (error) {
        console.error("Error adding to collection:", error);
        const errorMessage = error.response?.data?.message || 'Failed to add user. Please try again.';
        setAlert({ type: 'error', message: errorMessage });
      }
    },
    onCancel: () => setAlert(null)
  });
};

export const handleChatNow = async (
  targetUser,
  currentUser,
  contacts,
  navigation,
  setAlert,
  fetchContacts,
  fetchUsers
) => {
  try {
    const isAlreadyInContacts = contacts.some(contact => contact.user?._id === targetUser._id);
    // console.log(isAlreadyInContacts);
    if (isAlreadyInContacts) {
      navigation.navigate('Messaging', { userId: targetUser._id });
      return;
    }
    
    await handleAddToList(targetUser, currentUser, contacts, setAlert, fetchContacts, fetchUsers);
    navigation.navigate('Messaging', { userId: targetUser._id });
  } catch (error) {
    console.error("Error in handleChatNow:", error);
    setAlert({ type: 'error', message: 'Failed to start chat. Please try again.' });
  }
};