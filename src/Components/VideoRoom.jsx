import "/src/VideoRoom.css";
import AgoraRTC from "agora-rtc-sdk-ng";
import { useState,useEffect, useRef } from "react";
//iske baad se shuru hua tha

const VideoRoom = () => {

  const [isChatOpen, setIsChatOpen] = useState(false); // State for toggling chatbox
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");

  const ws = useRef(null); //websocket reference
  const toggleChat = () => {
    setIsChatOpen((prev) => !prev);
  };
 



  const APP_ID = '1aa47ae8827d40cab066b64abea5748e';
  const TOKEN = sessionStorage.getItem('token');
  const CHANNEL = sessionStorage.getItem('room');
  let name = sessionStorage.getItem('name');
  let UID = sessionStorage.getItem('UID');


  // Initialize WebSocket and set up listeners
  useEffect(() => {
    const roomName = CHANNEL; // Use channel as the room name
    const wsUrl = `wss://huddlehub-75fx.onrender.com/ws/chat/${roomName}/`;

    ws.current = new WebSocket(wsUrl);

    // WebSocket event listeners
    ws.current.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.message) {
        // Update chat messages
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: data.sender, text: data.message },
        ]);
      }
    };

    ws.current.onclose = () => {
      console.log("WebSocket disconnected");
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    // Clean up WebSocket on component unmount
    return () => {
      if (ws.current) ws.current.close();
    };
  }, [CHANNEL]);

  const sendMessage = () => {
    if (ws.current && messageInput.trim() !== "") {
      const messageData = JSON.stringify({
        sender: name,
        message: messageInput,
      });

      ws.current.send(messageData);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: name, text: messageInput },
      ]);
      setMessageInput(""); // Clear input field
    }
  };
  



  let localAudioTrack;
  let localVideoTrack;

  let remoteUsers = {};

  let agoraEngine = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

  // Initialize the local stream and join the room
  const joinAndDisplayLocalStream = async () => {
    try {
      // Join the channel
      await agoraEngine.join(APP_ID, CHANNEL, TOKEN, UID);

      // Create and publish local tracks
      localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      localVideoTrack = await AgoraRTC.createCameraVideoTrack();

      // Publish the tracks
      await agoraEngine.publish([localAudioTrack, localVideoTrack]);

      // Display the local player
      const localPlayerContainer = document.createElement("div");
      localPlayerContainer.id = UID;
      localPlayerContainer.textContent = name;
      localPlayerContainer.style.width = "200px";
      localPlayerContainer.style.height = "280px";
      document.getElementById('video-streams').append(localPlayerContainer);

      localVideoTrack.play(localPlayerContainer);

      // Set up event listeners for user events
      agoraEngine.on("user-published", handleUserPublished);
      agoraEngine.on("user-unpublished", handleUserUnpublished);

      console.log("Publish success!");
    } catch (error) {
      console.error("Error joining the room or publishing stream:", error);
    }
  };

  // Handle remote user publish event
  const handleUserPublished = async (user, mediaType) => {
    console.log(`User ${user.uid} published ${mediaType} track`);

    // Check if the user has a video track
    if (mediaType === "video") {
      console.log(`User ${user.uid} has video track`);
    } else {
      console.log(`User ${user.uid} has no video track`);
    }

    // Save the user to the remoteUsers object
    remoteUsers[user.uid] = user;
    
    // Subscribe to the user's media
    await subscribeToUser(user, mediaType);
  };

  // Handle remote user unpublished event
  const handleUserUnpublished = (user) => {
    console.log(`User unpublished: ${user.uid}`);
    delete remoteUsers[user.uid];
    const remotePlayerContainer = document.getElementById(user.uid.toString());
    if (remotePlayerContainer) {
      remotePlayerContainer.remove();
    }
  };

  // Subscribe to a remote user stream
  const subscribeToUser = async (user, mediaType) => {
    try {
      // Subscribe to the remote user's video or audio track
      await agoraEngine.subscribe(user, mediaType);
      console.log(`Subscribed to user: ${user.uid}`);

      if (mediaType === "video") {
        const remoteVideoTrack = user.videoTrack;

        // Create a container for the remote user
        const remotePlayerContainer = document.createElement("div");
        remotePlayerContainer.id = user.uid.toString();
        remotePlayerContainer.textContent = `User ${user.uid}`; // Display the user ID or name
        remotePlayerContainer.style.width = "400px";
        document.getElementById('active-speaker').append(remotePlayerContainer);

        // Play the remote user's video
        remoteVideoTrack.play(remotePlayerContainer);
      }

      if (mediaType === "audio") {
        const remoteAudioTrack = user.audioTrack;
        remoteAudioTrack.play();
      }
    } catch (error) {
      console.error("Error subscribing to user:", error);
    }
  };

  // Subscribe to existing users (pre-joined users)
  const subscribeToExistingUsers = () => {
    agoraEngine.remoteUsers.forEach((user) => {
      if (!remoteUsers[user.uid]) {
        console.log(`Subscribing to pre-existing user: ${user.uid}`);
        handleUserPublished(user, "video");
        handleUserPublished(user, "audio");
      }
    });
  };

  // Periodically check and subscribe to new users
  setInterval(() => {
    subscribeToExistingUsers();
  }, 5000);

  // Join the stream when the component mounts
  joinAndDisplayLocalStream();

  return (
    <div className="app-container">
      {/* Video Grid */}
      <div className="video-grid">
        <div id="video-streams" className="main-video"></div>
        <div id="active-speaker" className="remote-video"></div>
      </div>

      {/* Control Bar */}
      <div className="control-bar">
        <button id="mic-btn" className="control-btn">Mic</button>
        <button id="camera-btn" className="control-btn">Video</button>
        <button id="leave-btn" className="control-btn">End</button>
        <button className="control-btn">Share</button>
        <button className="control-btn" onClick={toggleChat}>Chat</button>
      </div>

      
      {isChatOpen && (
        <div className="chatbox">
          <h3>Chat</h3>
          <div className="chat-messages">
           {/* Messages will go here */}
           {messages.map((msg, idx) => (
              <div key={idx} className="chat-message">
                <strong>{msg.sender}:</strong> {msg.text}
              </div>
            ))}




            <div className="chat-input-container">
            <input
              type="text"
              className="chat-input"
              placeholder="Type a message"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
          {/* </div>
          <input
            type="text"
            className="chat-input"
            placeholder="Type a message"
          /> */}



          </div>
          </div>
      )}
    </div>
  );
};

export default VideoRoom;


