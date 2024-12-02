import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Joinmeet = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const initializeMeeting = async () => {
            const storedRoom = sessionStorage.getItem("room");
            if (!storedRoom) {
                alert("No meeting room provided!");
                navigate("/");
                return;
            }

            try {
                const UID = await joinNewMeeting(storedRoom);
                if (UID) {
                    const name = "Host";
                    console.log("name:", name)
                    console.log("UID", UID)
                    console.log("storedRoom", storedRoom)// Replace with dynamic name if available
                    await addMemberToMeeting(name, UID, storedRoom);
                    navigate("/VideoRoom");
                }
            } catch (error) {
                console.error("Error during initialization:", error);
            }
        };

        initializeMeeting();
    }, [navigate]);

    const joinNewMeeting = async (room) => {
        try {
            const meet_token = localStorage.getItem("Login-Token");
            console.log("Token retrieved:", meet_token);

            const response = await fetch(
                `https://huddlehub-75fx.onrender.com/get_token/${meet_token}/?channel=${room}`,
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
            console.log("Meeting joined successfully:", data);

            const UID = data.uid;
            const token = data.token;

            sessionStorage.setItem("UID", UID);
            sessionStorage.setItem("token", token);
            sessionStorage.setItem("room", room);
            console.log("Meeting data stored in sessionStorage.");

            return UID; // Return UID for adding the member
        } catch (error) {
            console.error("Error joining meeting:", error);
            throw error;
        }
    };

    const addMemberToMeeting = async (name, UID, room_name) => {
        try {
            console.log(name, UID, room_name)
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
            console.log("Member added to meeting successfully:", data);
            alert(`Member ${name} added to meeting ${room_name}!`);
        } catch (error) {
            console.error("Error adding member to meeting:", error);
            alert(error.message);
        }
    };

    return (
        <div>
            <h1>Setting up your meeting...</h1>
        </div>
    );
};

export default Joinmeet;