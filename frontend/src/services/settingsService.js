import axios from "axios";

const API_URL =
  "http://localhost:8000/api/settings";

export const getSettings = () =>
  axios.get(API_URL);

export const updateSettings = (data) =>
  axios.put(API_URL, data);