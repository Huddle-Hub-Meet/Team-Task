import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "/src/LogoPage.css";

const Logo = () => {

    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate("/signup");
        }, 5000);
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <>
            <div className="container">
                <div className="logo-div">
                    <img src="src/assets/logo.png" alt="logo" width="80px" height="80px" />
                    <div>
                        <h1 className="logo">HUDDLE HUB</h1>
                        <p className="logo logo-subtext">- LET US CONNECT -</p>
                    </div>
                </div>
            </div>
        </>
    )
};

export default Logo;