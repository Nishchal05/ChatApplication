import "./App.css";
import Body from "./Section/Body/Body";
import Navbar from "./Section/Navbar/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Section/Login/Login";
import Register from "./Section/Register/Register";
import { UserProvider } from "./contextapi";
import Findfriend from "./Section/Body/Findfriend";
function App() {
  return (
    <UserProvider><BrowserRouter>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Body />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/Addfriend" element={<Findfriend/>} />
        </Routes>
      </div>
    </BrowserRouter></UserProvider>
    
  );
}

export default App;
