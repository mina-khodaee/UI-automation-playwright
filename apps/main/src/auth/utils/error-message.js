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
    if (!error.errors || !Object.keys(error.errors).length) return error.title || error.message;

    let errorMessage = [];
    Object.keys(error.errors).forEach(field => {
      let messages = error.errors[field];
      messages = messages.map(message => <div>{message}</div>)
      errorMessage.push(messages)
    });

    return errorMessage;
  }

  return `Unknown error: ${error}`;
}
