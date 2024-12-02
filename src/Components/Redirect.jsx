import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Function to add a member to the meeting
const addMemberToMeeting = async (name, UID, room_name) => {
    try {
        console.log("Adding member:", name, UID, room_name);
        const response = await fetch("https://huddlehub-75fx.onrender.com/create_member/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, UID, room_name }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Error adding member to meeting");
        }

        const data = await response.json();
        console.log("Member added successfully:", data);
        alert(`Member ${name} added to meeting ${room_name}!`);
    } catch (error) {
        console.error("Error adding member to meeting:", error);
        alert(error.message);
    }
};

const Redirect = () => {
    const navigate = useNavigate();

    // Function to generate a meeting code
    const generateMeetingCode = async () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const codeLength = 8;
        let randomPart = '';

        for (let i = 0; i < codeLength; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            randomPart += characters[randomIndex];
        }

        const timestampPart = Date.now().toString(36);
        console.log("Code generated");
        return `${randomPart}${timestampPart}`;
    };

    useEffect(() => {
        handleNewMeeting();
    }, []);

    const handleNewMeeting = async () => {
        try {
            const room = await generateMeetingCode();
            console.log("Generated room:", room);
            sessionStorage.setItem("room", room);
            const name = "Host"; // Default host name

            const get_token = localStorage.getItem("Login-Token");
            console.log("Fetching token...");

            const response = await fetch(`https://huddlehub-75fx.onrender.com/get_token/${get_token}/?channel=${room}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Meeting token and UID received:", data);

            const UID = data.uid;
            const token = data.token;

            // Store values in sessionStorage
            sessionStorage.setItem("UID", UID);
            sessionStorage.setItem("token", token);
            sessionStorage.setItem("room", room);
            sessionStorage.setItem("name", name);
            console.log("Values stored in sessionStorage");

            // Add the host as a member to the meeting
            await addMemberToMeeting(name, UID, room);

            // Navigate to the video room
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

export default Redirect;