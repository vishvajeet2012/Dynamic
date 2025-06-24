import { Link } from "react-router-dom";

export default function HomePageControl() {
    return (

        <div className="w-full min-h-screen bg-slate-100 text-black p-4">
            <div className="flex justify-between items-center mb-6">
                <div className="text-2xl font-bold text-orange-400">
                    MyShop Admin
                </div>
                <div className="text-sm text-gray-400">Dashboard</div>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-semibold text-center mb-8">
                Home Page Control
            </h1>

          <div className=" flex flex-row gap-2 text-white items-center ">

            <div className="bg-gray-900 p-6 rounded-lg shadow-lg mb-6">
                <h2 className="text-xl font-semibold mb-3">Category Section</h2>
              <Link to="/AdminCategory"><button className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-full">Add Category</button></Link> 
          
            </div>

         
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg mb-6">
                <h2 className="text-xl font-semibold mb-3">Banner Section</h2>
               <Link to="/bannerMangement"> <button className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-full">
                    Add Banner
                </button></Link>
            </div>

            <div className="bg-gray-900 p-6 rounded-lg shadow-lg mb-6">
                <h2 className="text-xl font-semibold mb-3">AboutUs</h2>
               <Link to='/p/adminaboutUs' > <button className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-full">
                     AboutUs 
                </button></Link>
            </div>

              <div className="bg-gray-900 p-6 rounded-lg shadow-lg mb-6">
                <h2 className="text-xl font-semibold mb-3">Main Logo</h2>
               <Link to='/homelogo' > <button className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-full">
                     Add Logo 
                </button></Link>
            </div>

        
        </div>
        </div>
    );
}
