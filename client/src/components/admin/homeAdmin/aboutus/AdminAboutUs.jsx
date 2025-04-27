import { useEffect, useState } from "react";
import { useCreateAboutUs, useGetAboutUs } from "../../../../hooks/admin-hooks/useAboutus";

export default function AdminAboutUs() {
  const [FormData, setFormData] = useState({
    heading: "",
    isAboutusPage: false,
    longDescription: "",
    description: "",
    isHomepage: false
  });

  const [message, setMessage] = useState();
  const { createAboutUs, loading, error, success } = useCreateAboutUs();
  const { fetechAboutUs, getAllAboutUs } = useGetAboutUs();

  function handleInput(e) {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await createAboutUs(FormData);
      resetForm();
      setMessage(success?.message || "Successfully created!");
    } catch (err) {
      console.error(err);
    }
  };

  function resetForm() {
    setFormData({
      heading: "",
      isAboutusPage: false,
      longDescription: "",
      description: "",
      isHomepage: false
    });
    setTimeout(() => setMessage(""), 5000);
  }

  useEffect(() => {
    fetechAboutUs();
  }, []);

  return (
    <div className="w-full p-6 bg-gray-100 min-h-screen">
    
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Manage About Us</h1>
        <div className="flex gap-4">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Main Menu</button>
          <button  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">Back</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-8">
      
        <form onSubmit={handleFormSubmit} className="bg-white p-6 rounded-lg shadow-lg w-full lg:w-1/2 space-y-5">
          <div>
            <label htmlFor="heading" className="block mb-1 font-semibold text-gray-700">Heading</label>
            <input
              value={FormData.heading}
              name="heading"
              type="text"
              onChange={handleInput}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block mb-1 font-semibold text-gray-700">Short Description</label>
            <textarea
              value={FormData.description}
              name="description"
              onChange={handleInput}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              rows="3"
            />
          </div>

          <div>
            <label htmlFor="longDescription" className="block mb-1 font-semibold text-gray-700">Long Description</label>
            <textarea
              value={FormData.longDescription}
              name="longDescription"
              onChange={handleInput}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              rows="5"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isHomepage"
                checked={FormData.isHomepage}
                onChange={handleInput}
                className="accent-blue-500"
              />
              <span>Homepage</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isAboutusPage"
                checked={FormData.isAboutusPage}
                onChange={handleInput}
                className="accent-blue-500"
              />
              <span>About Us Page</span>
            </label>
          </div>

          {message && (
            <p className="text-green-600 font-semibold">{message}</p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md"
          >
            Submit
          </button>
        </form>

        <div className="bg-white p-6 rounded-lg shadow-lg w-full lg:w-1/2 overflow-y-auto max-h-[500px]">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Existing Entries</h2>
          <div className="space-y-4">
            {getAllAboutUs && getAllAboutUs.map((item) => (
              <div
                key={item?._id}
                className="p-4 bg-gray-100 rounded-lg border border-gray-300"
              >
                <h3 className="text-xl font-semibold text-gray-700">{item?.heading}</h3>
                <p className="text-gray-600 truncate mt-1">{item?.description}</p>
                <p className="text-gray-500 truncate">{item?.longDescription ? "Has Long Description" : "No Long Description"}</p>

                <div className="flex gap-4 mt-2">
                  <span className="px-2 py-1 bg-green-200 text-green-800 rounded-full text-xs">
                    Homepage: {item?.isHomepage ? "Yes" : "No"}
                  </span>
                  <span className="px-2 py-1 bg-green-200 text-green-800 rounded-full text-xs">
                    About Us Page: {item?.isAboutusPage ? "Yes" : "No"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
