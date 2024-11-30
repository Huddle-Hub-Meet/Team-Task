import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./Components/HomePage";
import Redirect from "./Components/Redirect";
 import VideoRoom from "./Components/VideoRoom";
 import Joinmeet from "./Components/Joinmeet";
// import Logo from './Components/Logo'
// import SignUp from './Components/SignUp'
// import Meeting from './Components/Meeting';
// import Newpassword from './Components/Newpassword';
// import Resetpassword from './Components/ResetPassword';
// import Loginform from './Components/Loginform'

// import Loader from './Components/Loader'
// import Api from './Components/Api'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route exact path="/" element={<Logo />} />
        <Route path="/signup" element={<SignUp />} /> */}

        <Route path="/" element={<HomePage />} /> 
        <Route path="/redirect" element={<Redirect />} />
        <Route path="/VideoRoom" element={<VideoRoom />} />
        <Route path="/Joinmeet" element={<Joinmeet/>} />

        {/* <Route path='/meeting' element={<Meeting />} />
        <Route path="/Loginform " element={<Loginform />} />
        <Route path="/Resetpassword " element={<Resetpassword />} />
        <Route path="/Newpassword" element={<Newpassword />} /> */}
        {/* <Route path="/" element={<HomePage />} /> */}
      </Routes>
    </BrowserRouter >
  )
}

export default App;
