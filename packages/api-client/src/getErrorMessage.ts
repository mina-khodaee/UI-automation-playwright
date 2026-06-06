export function getErrorMessage(error: any): string {
  if (error instanceof Error) {
    return error.message || error.name || 'An error occurred';
  }

  if (typeof error === 'string') {
    return error;
  }

  if (typeof error === 'object' && error !== null) {
    if (error.message) return error.message;
    if (error.title) return error.title;
    if (error.error) return typeof error.error === 'string' ? error.error : JSON.stringify(error.error);
    if (error.errors) {
      if (Array.isArray(error.errors)) {
        return error.errors.join(', ');
      }
      if (typeof error.errors === 'object') {
        return Object.entries(error.errors)
          .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join('; ') : value}`)
          .join(', ');
      }
    }
  }

  return `Unknown error: ${JSON.stringify(error)}`;
}
