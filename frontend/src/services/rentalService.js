import axios from "axios";

const API_URL =
  "http://localhost:8000/api/rentals";

export const getRentals = () =>
  axios.get(API_URL);

export const createRental = (data) =>
  axios.post(API_URL, data);

export const updateRental = (
  id,
  data
) =>
  axios.put(
    `${API_URL}/${id}`,
    data
  );

export const deleteRental = (id) =>
  axios.delete(
    `${API_URL}/${id}`
  );