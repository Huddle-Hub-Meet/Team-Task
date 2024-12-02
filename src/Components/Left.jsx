import React from "react";
import "/src/Left.css";
import { Link } from "react-router-dom";

const Left = () => {
    return (
        <>
            <div className="container">
                <div className="message">
                    You Have Left the Meeting
                </div>
                <button className="return">
                    <Link to="/HomePage">HOME</Link>
                </button>
            </div>
        </>
    )
};

export default Left;
