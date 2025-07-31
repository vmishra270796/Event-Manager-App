import axios from "axios";
export const base_URL = "http://localhost:5000";
const API_URL = "http://localhost:5000/api/events";

export const getEvents = async ({
  page = 1,
  limit = 10,
  name = "",
  date = "",
}) => {
  const params = new URLSearchParams({ page, limit, name, date });
  const res = await axios.get(`${API_URL}?${params}`);
  return res.data;
};

export const getEventById = async (id) => {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data;
};

export const createEvent = async (formData) => {
  const res = await axios.post(API_URL, formData);
  return res.data;
};

export const updateEvent = async (id, formData) => {
  const res = await axios.put(`${API_URL}/${id}`, formData);
  return res.data;
};

export const deleteEvent = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
};
