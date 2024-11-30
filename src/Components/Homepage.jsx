import { useEffect, useState } from "react";
import "/src/Homepage.css";
import { useNavigate } from "react-router-dom";

const Homepage = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const slides = [
        {
            image: "src/assets/slider1.png",
            text1: "Get a link that you can share",
            text2: "Click New Meeting to get a link that you can send to people",
        },
        {
            image: "src/assets/slider2.png",
            text1: "Your meeting is safe",
            text2: "No one can join a meeting unless invited or admitted by the host",
        },
    ];

    const navigate = useNavigate();

    const route = () => {
        navigate("/");
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <div className="container">
                <div className="logo-div" onClick={route}>
                    <img src="src/assets/logo.png" alt="logo" width="50px" height="50px" />
                    <div>
                        <h1 className="logo">HUDDLE HUB</h1>
                        <p className="logo-subtext">- LET US CONNECT -</p>
                    </div>
                </div>
                <div className="content">
                    <div className="description">
                        <h1>Video calls and meetings <br /> for everyone</h1>
                        <p><span>Connect, collaborate and celebrate from <br />
                            anywhere with Huddle Hub</span></p>
                        <div className="buttons">
                            <button className="meet-button"> <img src="src/assets/meet.svg" alt="meet" /> New Meeting
                            </button>
                            <button className="link-button">
                                <img src="src/assets/link.svg" alt="link" />
                                <input className="link-input" type="text" placeholder="Enter meet Link" />
                            </button>
                            <button className="join-button">Join</button>
                        </div>
                    </div>
                    <div className="carousel">
                        {slides.map((slide, index) => (
                            <div
                                className={`carousel-item ${index === currentIndex ? 'active' : ''}`}
                                key={index}
                                style={{ display: index === currentIndex ? 'block' : 'none' }}
                            >
                                <img className="slider-image" src={slide.image} alt="slider" />
                                <p className="slider-text1">{slide.text1}</p>
                                <p className="slider-text2">{slide.text2}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Homepage;
