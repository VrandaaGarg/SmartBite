import { Outlet } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import "./App.css"; // Assuming you have a CSS file for global styles

const App = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow px-4 py-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default App;
