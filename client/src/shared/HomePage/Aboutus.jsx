import { useEffect, useState } from "react";
import { useGetAboutUs } from "../../hooks/admin-hooks/useAboutus";

export default function AboutUs() {
  const [aboutUsData, setAboutUsData] = useState([]);
  const { fetechAboutUs, loading, error, getAllAboutUs } = useGetAboutUs();

  useEffect(() => {
    const fetchData = async () => {
      await fetechAboutUs();
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (getAllAboutUs?.length) {
      const filtered = getAllAboutUs.filter(item => item.isHomepage);
      setAboutUsData(filtered);
    }
  }, [getAllAboutUs]);

  return (
    <div className="bg-primaryReds w-full  text-white">
      <div className=" 2xl:max-w-[80rem] 2xl:mx-auto">
        {aboutUsData.map((value) => (
          <div key={value._id} className="">
            <div className="flex">
              <h1 className="text-2xl font-medium">{value?.heading}</h1>
            </div>
            <div className="ShortDeCription">
              <p>{value?.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
