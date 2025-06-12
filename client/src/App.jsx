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

function App() {
  return (
     <Routes>
      <Route path='/login' element={<Login />} />
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/category-update" element={<CategoryUpdateForm />} />
        <Route path="/p" element={<HomePageControl />} />
        <Route path='/AdminCategory' element={<AdminCategory />} />
        <Route path='/p/adminaboutus' element={<AdminAboutUs />} />
        {/* Add other protected routes here */}
      </Route>
    </Routes>
  );
}
export default App;