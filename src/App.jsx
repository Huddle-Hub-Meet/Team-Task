import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./Components/HomePage";
import Redirect from "./Components/Redirect";
import VideoRoom from "./Components/VideoRoom";
import Joinmeet from "./Components/Joinmeet";
import Login from './Components/Login';
import SignUp from "./Components/SignUp";
import Left from './Components/Left';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/HomePage" element={<HomePage />} />
        <Route path="/redirect" element={<Redirect />} />
        <Route path="/VideoRoom" element={<VideoRoom />} />
        <Route path="/Joinmeet" element={<Joinmeet />} />
        <Route path='/return' element={<Left />} />
      </Routes>
    </BrowserRouter >
  )
}

export default App;
