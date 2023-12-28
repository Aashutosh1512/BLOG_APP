import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './component/Navbar/NavbarElements'
import Home from './pages/home.js';
import FAQ from './pages/Faq.js';
import SignUp from './pages/Registration'
const App = () => {
  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/event" element={<FAQ />} />
          <Route path="/login" element={<SignUp/>}/>
        </Routes>
      </Router>
    </div>
  );
};

export default App;
