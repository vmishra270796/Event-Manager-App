import axios from "axios";
import { base_URL } from "./eventAPI";

const API_URL = `${base_URL}/api/users`;

/**
 * Registers a new user.
 * @param {object} userData - { name, email, password }
 * @returns {Promise<object>} The registered user data.
 */
export const registerUser = async (userData) => {
  const res = await axios.post(`${API_URL}/register`, userData);
  return res.data;
};

/**
 * Logs in a user.
 * @param {object} credentials - { email, password }
 * @returns {Promise<object>} The logged-in user data.
 */
export const loginUser = async (credentials) => {
  const res = await axios.post(`${API_URL}/login`, credentials);
  return res.data;
};

/**
 * Logs out the current user by clearing the server-side cookie.
 * @returns {Promise<object>} The server's logout confirmation message.
 */
export const logoutUser = async () => {
  const res = await axios.post(`${API_URL}/logout`);
  return res.data;
};
