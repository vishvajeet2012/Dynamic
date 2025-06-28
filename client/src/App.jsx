import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './components/client/home/main';
import CategoryUpdateForm from './image';
import HomePageControl from './components/admin/homeAdmin/Homepage';
import AdminCategory from './components/admin/homeAdmin/Category/Category';
import AdminAboutUs from './components/admin/homeAdmin/aboutus/AdminAboutUs';
import Signup from './components/client/auth/signup';
import Login from './components/client/auth/login';
import ProtectedRoute from './components/ProtectedRoutes';
import CreateHomeLogo from './components/admin/homeAdmin/Logo/CreateHomeLogo';
import CreateBanner from './components/admin/homeAdmin/banners/CreateBanner';
import Header from './shared/header';
import UserProfile from './components/client/userProfile/Index';
import AdminProduct from './components/admin/Admin-Product';
function App() {
  return (
    <>
      <Header/>
     <Routes>

      <Route path='/login' element={<Login />} />
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />

      <Route element={<ProtectedRoute />}>
      <Route path="/profile" element={<UserProfile />} />
        <Route path="/category-update" element={<CategoryUpdateForm />} />
        <Route path="/p" element={<HomePageControl />} />
        <Route path='/AdminCategory' element={<AdminCategory />} />
        <Route path='/p/adminaboutus' element={<AdminAboutUs />} />
        <Route path="/homelogo" element={<CreateHomeLogo />} />
        <Route path = "/bannerMangement" element={<CreateBanner/>} />
        <Route path= "/AdminProduct" element={<AdminProduct/>} />
        {/* Add other protected routes here */}
      </Route>
    </Routes>
    </>
  );
}
export default App;