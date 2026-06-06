import { t } from 'i18next';

// ----------------------------------------------------------------------

export function getErrorMessage(error) {
  if (error instanceof Error) {
    return error.message || error.name || 'An error occurred';
  }

  if (typeof error === 'string') {
    return t(error);
  }

  if (typeof error === 'object' && error !== null) {
    // Handle your API error format: { errors: { "Key": ["message1", "message2"] } }
    if (error.errors && Object.keys(error.errors).length > 0) {
      const errorMessages = [];
      
      Object.entries(error.errors).forEach(([field, messages]) => {
        if (Array.isArray(messages)) {
          // Add each message
          messages.forEach(message => {
            errorMessages.push(message);
          });
        } else {
          errorMessages.push(messages);
        }
      });

      // Return the first error or all errors joined
      if (errorMessages.length === 1) {
        return errorMessages[0];
      }
      
      // For multiple errors, join with bullet points or line breaks
      return errorMessages.join('\n• ');
    }

    // Fallback for other error formats
    return error.title || error.message || 'An error occurred';
  }

  return `Unknown error: ${error}`;
}
