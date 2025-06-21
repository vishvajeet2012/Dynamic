import { useState } from "react";
import axios from "axios";
import { homeUrl } from "../../../lib/baseUrl";

export default function UploadImageComponent() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    // Reset states when new file is selected
    setError(null);
    setSuccess(false);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file); // 'image' must match your backend field

    // For debugging
    for (let [key, value] of formData.entries()) {
      console.log("FormData entry:", key, value);
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      
      const token = localStorage.getItem('token');
      
      const response = await axios.post(`${homeUrl}/uploadImage`, formData, {
        headers: {
           'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        },
      });

      console.log("Upload successful:", response.data);
      setSuccess(true);
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.response?.data?.message || "Failed to upload image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Uploading..." : "Upload"}
      </button>

      {loading && <p>Uploading...</p>}
      {success && <p>Upload successful!</p>}
      {error && <p>Error: {error}</p>}
    </div>
  );
}