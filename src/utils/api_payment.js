import axios from "axios";

const API_URL = "http://localhost:5000";
export const verifyPayment = async (data) => {
  const res = await axios.post(`${API_URL}/payment`, JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.data;
};
