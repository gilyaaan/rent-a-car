import axios from "axios";

const API_URL =
  "http://localhost:8000/api/reports";

export const getRevenueReport = () =>
  axios.get(`${API_URL}/revenue`);

export const getRentalReport = () =>
  axios.get(`${API_URL}/rentals`);

export const getVehicleReport = () =>
  axios.get(`${API_URL}/vehicles`);

export const getCustomerReport = () =>
  axios.get(`${API_URL}/customers`);