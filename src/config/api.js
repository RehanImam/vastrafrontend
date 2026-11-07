const API_BASE_URL = (
  process.env.REACT_APP_API_URL || "https://vastrabackend-mauve.vercel.app/api/v1"
).replace(/\/+$/, "");

export default API_BASE_URL;
