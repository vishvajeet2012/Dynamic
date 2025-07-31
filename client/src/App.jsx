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
import AdminProductManagement from './components/admin/Admin-Product/adminGetproduct';
import Footer from './shared/footer';
import ForgetPassowrd from './components/client/auth/ForgetPassowrd';
import CategroyPage from './components/client/categorypage';
import ProductPage from './components/client/pdppage/productpage';
import Wishlistpage from './components/client/wishlist/wishlistPage';
import CartPage from './components/client/cartPage';
import OrderPlacementUI from './components/client/order';
import AdminOrder from './components/admin/Adminorders';
function App() {
  return (
    <>
      <Header/>
     <Routes>

      <Route path='/login' element={<Login />} />
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
    <Route path="/:id" element={<ProductPage />} />
    <Route path='cart' element={<CartPage />} />
    <Route path="/wishlist" element={<Wishlistpage/>} />
      <Route element={<ProtectedRoute />}>
      <Route path="/profile" element={<UserProfile />} />

        <Route path="/category-update" element={<CategoryUpdateForm />} />
        <Route path="/p" element={<HomePageControl />} />
        <Route path='/admincategory' element={<AdminCategory />} />
        <Route path='/p/adminaboutus' element={<AdminAboutUs />} />
        <Route path="/homelogo" element={<CreateHomeLogo />} />
        <Route path = "/bannerMangement" element={<CreateBanner/>} />
        <Route path= "/AdminProduct" element={<AdminProduct/>} />
        <Route path='/fogretPassword' element={<ForgetPassowrd/>} />
        <Route path='/productupdatedelete' element={<AdminProductManagement/>} />
        <Route path="/category/:id" element={<CategroyPage />} />
        <Route path ="/checkout"  element={<OrderPlacementUI/>}/>
        <Route path="/adminorder" element={<AdminOrder/>}/>
        {/* Add other protected routes here */}
      </Route>
    </Routes>
    <Footer/>
    </>
  );
}
export default App;