import axios from "axios";

const API_URL =
  "http://localhost:8000/api/payments";

export const getPayments = () =>
  axios.get(API_URL);

export const createPayment = (data) =>
  axios.post(API_URL, data);

export const updatePayment = (
  id,
  data
) =>
  axios.put(
    `${API_URL}/${id}`,
    data
  );

export const deletePayment = (id) =>
  axios.delete(
    `${API_URL}/${id}`
  );