import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Render pe deploy hone ke baad, apne backend ka live URL yahan daalo
// e.g. "https://ai-social-agent-api.onrender.com"
export const BASE_URL = "https://YOUR-RENDER-BACKEND-URL.onrender.com";

const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
