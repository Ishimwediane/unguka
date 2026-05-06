import { Alert } from 'react-native';

export const handleApiError = (error, title = 'Action Failed') => {
  const message = error.message || 'An unexpected error occurred';
  const code = error.code || 'UNKNOWN_ERROR';
  
  Alert.alert(
    title,
    `Message: ${message}\n\nError Code: ${code}`,
    [{ text: 'OK' }]
  );
};

export const showSuccess = (title, message) => {
  Alert.alert(
    title,
    message,
    [{ text: 'Continue' }]
  );
};