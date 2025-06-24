import { useState, useEffect } from "react";
import { homeUrl } from "../../../lib/baseUrl";
import axios from "axios";

export const getLogoheader = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const getLogo = async () => {
        const token = localStorage.getItem("token");
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(`${homeUrl}/gethomelogo`, {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            });
            setSuccess(response?.data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getLogo();
    }, []); // Empty dependency array means this runs once on mount

    return { getLogo, loading, error, success };
};