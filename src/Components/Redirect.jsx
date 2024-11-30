import  { useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
        console.log("code generated");
        return `${randomPart}-${timestampPart}`;
    };

    useEffect(() => {
        handleNewMeeting();
    }, []);


    const handleNewMeeting = async () => {
        try {
            const room = await generateMeetingCode();
            console.log(room)
            sessionStorage.setItem('room',room)
            const name = "Host";
            console.log("waiting for response");
            const response = await fetch(`https://huddlehub-75fx.onrender.com/get_token/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InN1Z2FuZGhpMjMxMTA2OEBha2dlYy5hYy5pbiIsImV4cCI6MTczMjk1NTAwNiwiaWF0IjoxNzMyOTUxNDA2fQ.0ugHclRX0JAEnN2iYHN9w7lxfPWhPQLgPS0sf1jEbwM/?channel=${room}`,
                {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                    },
                // body: JSON.stringify({ room }),
                
            });

            console.log("fetched");
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Meeting created:", data);
            const UID = data.uid;
            const token = data.token;




            sessionStorage.setItem("UID", UID);
            sessionStorage.setItem("token", token);
            sessionStorage.setItem("room", room);
            sessionStorage.setItem("name", name);
            console.log("stored in session storage");
            navigate("/VideoRoom");
        } 
        catch (error) {
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
