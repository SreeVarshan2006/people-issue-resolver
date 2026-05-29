// Change this to your Render backend URL when deploying to Netlify
// Example: const BASE_URL = 'https://people-issue-resolver-api.onrender.com'
// For local development, leave as empty string (Vite proxy handles it)

const BASE_URL = import.meta.env.VITE_API_URL || ''

export default BASE_URL
