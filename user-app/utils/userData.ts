import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ContactDetails {
  name: string;
  phone: string;
  email: string;
  age: number;
  userId: string;
  completedAt: string;
}

export const getUserContactDetails = async (currentUserId?: string): Promise<ContactDetails | null> => {
  try {
    const data = await AsyncStorage.getItem('userContactDetails');
    if (!data) return null;
    
    const contactDetails: ContactDetails = JSON.parse(data);
    
    // If we have a current user ID, check if the stored data belongs to this user
    if (currentUserId && contactDetails.userId !== currentUserId) {
      // Data belongs to a different user, clear it
      await clearUserContactDetails();
      return null;
    }
    
    return contactDetails;
  } catch (error) {
    console.error('Error getting user contact details:', error);
    return null;
  }
};

export const setUserContactDetails = async (contactDetails: ContactDetails): Promise<void> => {
  try {
    await AsyncStorage.setItem('userContactDetails', JSON.stringify(contactDetails));
  } catch (error) {
    console.error('Error setting user contact details:', error);
    throw error;
  }
};

export const clearUserContactDetails = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem('userContactDetails');
  } catch (error) {
    console.error('Error clearing user contact details:', error);
    throw error;
  }
};