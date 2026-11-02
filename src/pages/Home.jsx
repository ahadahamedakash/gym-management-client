import { useNavigate } from "react-router";

import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { useEffect } from "react";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/login", { replace: true });
  }, [navigate]);

  return (
    <>
      <Navbar />
      <Footer />
    </>
  );
};

export default Home;
