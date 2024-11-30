import  { useState, useEffect } from "react";
import "/src/Login.css";
import axios from "axios";
import image from "/src/assets/image.png";
import { Link, useNavigate } from "react-router-dom";
import { Input, Button, Checkbox } from "@nextui-org/react";
import { MailIcon } from "../assets/icons/MailIcon";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem("userEmail");
    const savedPassword = localStorage.getItem("userPassword");

    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Invalid email format");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("https://huddlehub-75fx.onrender.com/login/", {
        email,
        password,
      });

      const token = response?.data;

      localStorage.setItem("Login-Token", token);
      console.log("Token stored:", token);
      toast.success("Login successful!");
      navigate("/home");

    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);

      if (error.response?.status === 401) {
        toast.error("Wrong password");
      } else if (error.response?.data?.message) {
        toast.error(error.response?.data?.message);
      } else {
        toast.error("Login Unsuccessful. Try Again");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wrapper bg-black">
      <div className="logo-div">
        <img src="src/assets/logo.png" alt="logo" width="40px" height="40px" />
        <div>
          <h1 className="logo">HUDDLE HUB</h1>
          <p className="logo logo-subtext">- LET US CONNECT -</p>
        </div>
      </div>

      <div className="left-side">
        <img className="network" src={image} alt="network illustration" />
      </div>
      <div className="login-container">
        <form onSubmit={handleSubmit} className="login-form flex flex-col gap-4">
          <h2>Welcome back!</h2>
          <p>Enter your email and password</p>

          <Input
            size="lg"
            startContent={<MailIcon />}
            type="email"
            placeholder="Email"
            value={email}
            variant="bordered"
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            size="lg"
            startContent={<MailIcon />}
            variant="bordered"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="form-options">
            <Checkbox>Remember me</Checkbox>
            <Link to="/reset-password" className="forgot-password">
              Forgot Password?
            </Link>
          </div>

          <Button
            size="lg"
            color="secondary"
            type="submit"
            isLoading={loading}
            isDisabled={!email || !password}
            onSubmit={<Link to="/home"></Link>}
          >
            {loading ? "Logging in..." : "Login"}

          </Button>

          {error && <p className="error-message">{error}</p>}
        </form>

        <div className="mt-4 text-right">
          Create a new account ?{" "}
          <Link to="/signup" className="text-blue-600">Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
