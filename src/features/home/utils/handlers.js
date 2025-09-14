import { addToContacts } from "../contancts.api";

export const handleAddToList = async (
  targetUser,
  currentUser,
  contacts,
  setAlert,
  fetchContacts,
  fetchUsers,
  initialAlertState
) => {
  console.log(currentUser?._id , targetUser?._id);
  if (!currentUser?._id || !targetUser?._id) {
    console.error("Both User ID and Target User ID are required");
    setAlert({visible: true, type: 'error',title: "Notice", message: 'User information is missing' });
    return;
  }

  const isAlreadyInContacts = contacts.some(contact => contact.user?._id === targetUser._id);
  if (isAlreadyInContacts) {
    setAlert({visible: true, type: 'info',title: "Notice", message: 'This user is already in your list.' });
    return;
  }

  if (currentUser.linkCoins < 1) {
    setAlert({visible: true, type: 'error',title: "Notice", message: 'Insufficient LinkCoins. Please purchase more.' });
    return;
  }

  setAlert({
    visible: true,
    type: 'confirm',
    title: "Notice",
    message: 'Spend 1 LinkCoin to add this user to your list. Are you sure?',
    onConfirm: async () => {
      try {
        await addToContacts(currentUser._id, targetUser._id);
        setTimeout(() => {
          setAlert({
            ...initialAlertState,
            visible: true,
            type: 'success',
            title: "Notice",
            message: 'User added to collection successfully!'
          });
        }, 0);

        // Refresh data
        if (fetchContacts) await fetchContacts();
        if (fetchUsers) await fetchUsers();
      } catch (error) {
        console.error("Error adding to collection:", error);
        const errorMessage = error.response?.data?.message || 'Failed to add user. Please try again.';
        setTimeout(() => {
          setAlert({
            ...initialAlertState,
            visible: true,
            type: 'error',
            title: "Notice",
            message: errorMessage
          });
        }, 0);
      }
    },
    onCancel: () => setAlert(initialAlertState)
  });
};

export const handleChatNow = async (
  targetUser,
  currentUser,
  contacts,
  navigation,
  setAlert,
  fetchContacts,
  fetchUsers,
  initialAlertState
) => {
  try {
    const isAlreadyInContacts = contacts.some(contact => contact.user?._id === targetUser._id);
    // console.log(isAlreadyInContacts);
    if (isAlreadyInContacts) {
      navigation.navigate('Messaging', { userId: targetUser._id });
      return;
    }
    
    await handleAddToList(targetUser, currentUser, contacts, setAlert, fetchContacts, fetchUsers, initialAlertState);
    navigation.navigate('Messaging', { userId: targetUser._id });
  } catch (error) {
    console.error("Error in handleChatNow:", error);
    setTimeout(() => {
          setAlert({
            ...initialAlertState,
            visible: true,
            type: 'error',
            title: "Notice",
            message: errorMessage
          });
        }, 0);
  }
};