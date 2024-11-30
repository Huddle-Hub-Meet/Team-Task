import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import "/src/Signup.css";

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        password: "",
        confirmPassword: "",
        termsAccepted: false,
    });

    const [passwordVisible, setPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [passwordStrength, setPasswordStrength] = useState("");

    const validatePassword = (password) => {
        if (password.length < 6) return "Weak";
        if (!/[A-Z]/.test(password)) return "Medium";
        if (!/[^a-zA-Z0-9]/.test(password)) return "Strong";
        return "Very Strong";
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });

        if (name === "password") {
            setPasswordStrength(validatePassword(value));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        // Validate password match and terms acceptance
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            setLoading(false);
            return;
        }

        if (!formData.termsAccepted) {
            setError("You must accept the Terms of Service.");
            setLoading(false);
            return;
        }

        try {
            // Make the API call to sign up
            const response = await fetch("https://huddlehub-75fx.onrender.com/signup/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    email: formData.email,
                    phone_number: formData.phone_number,
                    password: formData.password,
                    confirmPassword: formData.confirmPassword,
                    termsAccepted: formData.termsAccepted,
                }),
            });

            const datas = await response.json();
            console.log("Response from API:", datas);  // Log the full response to check its structure

            // Handle conflicts (e.g., duplicate email)
            if (response.status === 409) {
                toast.error("User already exists. Please try another email.");
                setLoading(false);
                return;
            }

            // Check for non-OK response status and throw an error
            if (!response.ok) {
                throw new Error("Signup failed. Please try again.");
            }

            // Check if the expected 'datas.data' exists and contains the token
            if (datas.msg) {

                // Reset form data
                setFormData({
                    first_name: "",
                    last_name: "",
                    email: "",
                    phone_number: "",
                    password: "",
                    confirmPassword: "",
                    termsAccepted: false,
                });

                setError("");
                toast.success("Successfully signed up!");
                navigate("/home");
            } else {
                setError("Signup failed. No token received.");
                toast.error("An error occurred. Please try again.");
            }
        } catch (err) {
            setError(err.message);
            toast.error("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible((prevState) => !prevState);
    };

    return (
        <>
            <div className="logo-div">
                <img src="src/assets/logo.png" alt="logo" width="40px" height="40px" />
                <div>
                    <h1 className="logo">HUDDLE HUB</h1>
                    <p className="logo logo-subtext">- LET US CONNECT -</p>
                </div>
            </div>

            <div className="signup-container">
                <form className="signup-form" onSubmit={handleSubmit}>
                    <h2>Create A New Account</h2>

                    {error && <p className="error">{error}</p>}

                    <div className="form-group">
                        <input
                            type="text"
                            name="first_name"
                            placeholder="First Name"
                            value={formData.first_name}
                            onChange={handleChange}
                            required
                            autoFocus
                        />
                        <input
                            type="text"
                            name="last_name"
                            placeholder="Last Name"
                            value={formData.last_name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="tel"
                            name="phone_number"
                            placeholder="Phone Number"
                            value={formData.phone_number}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type={passwordVisible ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <span className={passwordStrength.toLowerCase()}>
                            {passwordStrength}
                        </span>
                    </div>
                    <div className="form-group">
                        <input
                            type={passwordVisible ? "text" : "password"}
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                        <button
                            type="button"
                            className="toggle-password-btn"
                            onClick={togglePasswordVisibility}
                        >
                            {passwordVisible ? "Hide Passwords" : "Show Passwords"}
                        </button>
                    </div>
                    <div className="form-group checkbox">
                        <input
                            type="checkbox"
                            name="termsAccepted"
                            checked={formData.termsAccepted}
                            onChange={handleChange}
                        />
                        <label>
                            I agree to the <a href="/terms">Terms of Service</a> and{" "}
                            <a href="/privacy">Privacy Policy</a>.
                        </label>
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? "Signing Up..." : "Sign Up"}
                    </button>
                </form>
            </div>
        </>
    );
};

export default Signup;
