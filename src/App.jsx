import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from './Components/Login';
import SignUp from "./Components/SignUp";
import Homepage from "./Components/Homepage";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/home" element={<Homepage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
