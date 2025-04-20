import { useState } from "react";
import axios from "axios"; // Make sure you import axios
import { homeUrl } from "../../lib/baseUrl";

export const useCreateAboutUs = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const createAboutUs = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post(`${homeUrl}/createaboutus`, formData);
      setSuccess(response?.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { createAboutUs, loading, error, success };
};
