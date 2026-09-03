import axios from "axios";

const API_URL =
  "http://localhost:8000/api/reservations";

export const getReservations = () =>
  axios.get(API_URL);

export const createReservation = (data) =>
  axios.post(API_URL, data);

export const updateReservation = (
  id,
  data
) =>
  axios.put(
    `${API_URL}/${id}`,
    data
  );

export const deleteReservation = (id) =>
  axios.delete(
    `${API_URL}/${id}`
  );