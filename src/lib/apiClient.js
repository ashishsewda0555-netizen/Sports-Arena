const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

/**
 * Helper to fetch data from the backend API.
 * Automatically handles JSON parsing and standardizes error throwing.
 */
export async function fetchApi(endpoint, options = {}) {
  // We don't automatically inject auth tokens here if using cookies,
  // because the Express server uses cookie-parser and we can rely on credentials: 'include'.
  // However, we must pass credentials so the browser sends the token cookie!
  const config = {
    ...options,
    credentials: options.credentials || 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  // Remove Content-Type if we are sending FormData (for file uploads)
  if (options.body instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (response.status === 204) {
    return null; // No content
  }

  const data = await response.json();

  if (!response.ok) {
    // Build a detailed error message from validation details if available
    const errorObj = data?.error;
    let message = errorObj?.message || 'API Request Failed';

    if (errorObj?.details && Array.isArray(errorObj.details) && errorObj.details.length > 0) {
      const fieldErrors = errorObj.details
        .map((d) => d.field ? `${d.field}: ${d.message}` : d.message)
        .join('. ');
      message = fieldErrors;
    }

    throw new Error(message);
  }

  return data.data; // Server is structured to return { data: ... }
}
