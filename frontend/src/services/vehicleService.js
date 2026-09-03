import axios from "axios";

const API_URL =
  "http://localhost:8000/api/vehicles";

export const getVehicles = () =>
  axios.get(API_URL);

export const createVehicle = (data) =>
  axios.post(API_URL, data);

export const updateVehicle = (
  id,
  data
) =>
  axios.put(
    `${API_URL}/${id}`,
    data
  );

export const deleteVehicle = (id) =>
  axios.delete(
    `${API_URL}/${id}`
  );