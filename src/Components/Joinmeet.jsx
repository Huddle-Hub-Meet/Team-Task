import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Joinmeet = () => {
    const navigate = useNavigate();
   
    useEffect(() => {
        const storedRoom = sessionStorage.getItem("room");
        if (!storedRoom) {
            alert("No meeting room provided!");
            navigate("/");
        } else {
            joinNewMeeting(storedRoom);
        }
    }, [navigate]);


    const joinNewMeeting = async (room) => {
        try {
            const name = "Host";
            const response = await fetch(
                `https://huddlehub-75fx.onrender.com/get_token/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InN1Z2FuZGhpMjMxMTA2OEBha2dlYy5hYy5pbiIsImV4cCI6MTczMjk1NTAwNiwiaWF0IjoxNzMyOTUxNDA2fQ.0ugHclRX0JAEnN2iYHN9w7lxfPWhPQLgPS0sf1jEbwM/?channel=${room}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Meeting created successfully:", data)
            const UID = data.uid;
            const token = data.token;

            sessionStorage.setItem("UID", UID);
            sessionStorage.setItem("token", token);
            sessionStorage.setItem("room", room);
            sessionStorage.setItem("name", name);
            console.log("Data stored in sessionStorage.");
            navigate("/VideoRoom");
        } catch (error) {
            console.error("Error creating meeting:", error);
        }
    };

    return (
        <div>
            <h1>Setting up your meeting...</h1>
        </div>
    );
};

export default Joinmeet;
