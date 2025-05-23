import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './components/client/home/main';
import CategoryUpdateForm from './image';
import Signup from './login';
import HomePageControl from './components/admin/homeAdmin/Homepage';
import AdminCategory from './components/admin/homeAdmin/Category/Category';
import AdminAboutUs from './components/admin/homeAdmin/aboutus/AdminAboutUs';

function App() {
  return (
    <Router>
   
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/category-update" element={<CategoryUpdateForm />} />
        <Route path="/p" element={<HomePageControl />} />
      <Route path='/AdminCategory' element={<AdminCategory/>}/>
      <Route path='/p/adminaboutus'   element={<AdminAboutUs/>}/> 

      </Routes>
    </Router>
  );
}
export default App;