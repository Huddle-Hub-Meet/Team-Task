import "/src/VideoRoom.css";
import AgoraRTC from "agora-rtc-sdk-ng";
import { useState, useEffect, useRef } from "react";
import { Button, ButtonGroup } from "@nextui-org/react";
import { Input, Card } from "@nextui-org/react";

const VideoRoom = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [istranslaterOpen, setIsTranslaterOpen] = useState(false);
  const [dateTime, setDateTime] = useState(new Date());
  const [isVideoOn, setIsVideoOn] = useState(true);
  const ws = useRef(null);
  const localAudioTrackRef = useRef(null);
  const localVideoTrackRef = useRef(null);
  const APP_ID = "1aa47ae8827d40cab066b64abea5748e";
  const TOKEN = sessionStorage.getItem("token");
  const CHANNEL = sessionStorage.getItem("room");
  const name = sessionStorage.getItem("name");
  const UID = sessionStorage.getItem("UID") || null;
  const agoraEngine = useRef(AgoraRTC.createClient({ mode: "rtc", codec: "vp8" }));
  const remoteUsers = useRef({});

  const toggleChat = () => setIsChatOpen((prev) => !prev);
  const toggleTranslator = () => setIsTranslaterOpen((prev) => !prev);

  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");

  // Update the date and time every second
  useEffect(() => {
    const intervalId = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);


  // Initialize WebSocket
  useEffect(() => {
    if (!CHANNEL) {
      console.error("Room name not found in sessionStorage.");
      return;
    }

    // WebSocket URL based on channel
    const wsUrl = `wss://huddlehub-75fx.onrender.com/ws/chat/${CHANNEL}/`;
    // const wsUrl = `wss://huddlehub.sugandhi.tech/ws/chat/${CHANNEL}/`;

    const connectWebSocket = () => {
      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        console.log("WebSocket connected successfully!");
      };

      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("Received message from WebSocket:", data);

          if (data.message) {
            setMessages((prevMessages) => [
              ...prevMessages,
              { sender: data.sender, text: data.message },
            ]);
          }
        } catch (err) {
          console.error("Error parsing WebSocket message:", err);
        }
      };

      ws.current.onerror = (error) => {
        console.error("WebSocket error:", error);
        setTimeout(() => {
          console.log("Retrying WebSocket connection...");
          connectWebSocket();
        }, 5000); // Retry after 5 seconds
      };

      ws.current.onclose = () => {
        console.log("WebSocket disconnected.");
        setTimeout(() => {
          console.log("Attempting to reconnect WebSocket...");
          connectWebSocket();
        }, 5000); // Retry after 5 seconds
      };
    };

    connectWebSocket();

    return () => {
      if (ws.current) ws.current.close();
    };
  }, [CHANNEL]); // Only re-run if the `CHANNEL` changes

  // Send Message
  const sendMessage = () => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN && messageInput.trim()) {
      const messageData = JSON.stringify({ sender: name, message: messageInput });
      ws.current.send(messageData);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: name, text: messageInput },
      ]);
      setMessageInput("");
    } else {
      console.error("WebSocket not open or message is empty");
    }
  };

  // Handle the joining and displaying local stream
  const joinAndDisplayLocalStream = async () => {
    try {
      const client = agoraEngine.current;
      await client.join(APP_ID, CHANNEL, TOKEN, UID);

      const localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      const localVideoTrack = await AgoraRTC.createCameraVideoTrack();

      localAudioTrackRef.current = localAudioTrack;
      localVideoTrackRef.current = localVideoTrack;

      await client.publish([localAudioTrack, localVideoTrack]);

      const localPlayerContainer = document.createElement("div");
      localPlayerContainer.id = UID;
      localPlayerContainer.style.width = "700px";
      localPlayerContainer.style.height = "500px";
      document.getElementById("video-streams").append(localPlayerContainer);

      localVideoTrack.play(localPlayerContainer);

      client.on("user-published", handleUserPublished);
      client.on("user-unpublished", handleUserUnpublished);
      console.log("Publish success!");

    } catch (error) {
      console.error("Error joining the room or publishing stream:", error);
    }
  };

  // Handle Remote Users
  const handleUserPublished = async (user, mediaType) => {
    console.log(user);
    remoteUsers.current[user.uid] = user;
    await subscribeToUser(user, mediaType);
  };

  const handleUserUnpublished = (user) => {
    delete remoteUsers.current[user.uid];
    const remotePlayerContainer = document.getElementById(user.uid.toString());
    if (remotePlayerContainer) remotePlayerContainer.remove();
  };

  const subscribeToUser = async (user, mediaType) => {
    try {
      const client = agoraEngine.current;
      await client.subscribe(user, mediaType);

      if (mediaType === "video") {
        const remoteVideoTrack = user.videoTrack;

        const remotePlayerContainer = document.createElement("div");
        remotePlayerContainer.id = user.uid.toString();
        remotePlayerContainer.style.width = "300px";
        remotePlayerContainer.style.height = "300px";
        const container = document.getElementById("active-speaker");
        if (!container) {
          console.error("Remote video container not found.");
          return;
        }

        document.getElementById("active-speaker").append(remotePlayerContainer);

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

  // Toggle Microphone
  const toggleMic = () => {
    if (localAudioTrackRef.current) {
      localAudioTrackRef.current.setEnabled(!isMicOn);
      setIsMicOn(!isMicOn);
    } else {
      console.error("Local audio track is not initialized.");
    }
  };

  // Toggle Video
  const toggleVideo = () => {
    const localPlayerContainer = document.getElementById(UID);

    if (localVideoTrackRef.current && localPlayerContainer) {
      localVideoTrackRef.current.setEnabled(!isVideoOn);
      setIsVideoOn(!isVideoOn);
    } else {
      console.error("Local video track is not initialized or container is missing.");
    }
  };

  // End Meeting
  const endMeeting = async () => {
    await agoraEngine.current.leave();
    if (ws.current) ws.current.close();
    window.location.href = "/return";
  };

  useEffect(() => {
    joinAndDisplayLocalStream();
  }, []);

  return (
    <div className="app-container">
      <div className="title-bar">
        <div className="Logo">
          <img src="/src/assets/logo.png" alt="logo" width={"40px"} height={"40px"} />
        </div>
        <div className="details">
          <div className="title">
            Huddle-Hub
          </div>
          <div className="date-time">
            {dateTime.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="working-area">
        <div className="video-grid">
          <div id="video-streams" className="main-video"></div>
          <div id="active-speaker" className="remote-video"></div>
        </div>

        <div className="control-bar" shadow="sm">
          <div className="code">
            {CHANNEL}
          </div>
          <div className="buttons">
            <Button
              className={`mic control-btn ${!isMicOn ? "off" : ""}`}
              onClick={toggleMic}
            >
              <img src="/src/assets/mic.svg" />
            </Button>
            <Button
              className={`video control-btn ${!isVideoOn ? "off" : ""}`}
              onClick={toggleVideo}
            >
              <img src="/src/assets/video.svg" />
            </Button>
            <Button className="hand control-btn">
              <img src="/src/assets/raise-hand.svg" />
            </Button>
            <Button className="end control-btn" onClick={endMeeting}>
              END
              {/* <img src="/src/assets/endcall.svg" /> */}
            </Button>
            <Button className="attendance control-btn" onClick={toggleTranslator}>
              <img src="/src/assets/translate.svg" />
            </Button>
          </div>
          <div className="buttons-right">
            <Button className="particiapnts control-btn">
              <img src="/src/assets/participants.svg" />
            </Button>
            <Button className="chat control-btn" onClick={toggleChat}>
              <img src="/src/assets/message.svg" />
            </Button>
          </div>
        </div>
      </div>

      {isChatOpen && (
        <Card className="chatbox">
          <h3>Chat</h3>
          <div className="chatbox-div">
            <ul>
              {messages.map((msg, index) => (
                <li key={index}>{msg.text}</li>
              ))}
            </ul>
          </div>
          <form className="chat-input-form">
            <Input
              className="chat-input"
              clearable
              fullWidth
              placeholder="Type a message..."
              value={messageInput}
              onChange={(e) =>
                setMessageInput(e.target.value)}
            />
            <Button auto onClick={sendMessage}>
              Send
            </Button>
          </form>
        </Card>
      )}

      {istranslaterOpen && (
        <Card className="Translator">
          <h3>Translator</h3>
          <div className="Translator-div">
          </div>
          <form className="translator-input-form">
            <Input
              className="translator-input"
              clearable
              fullWidth
              placeholder="Type a message..."
            />
            <div className="translate_buttons">
              <Button>
                Read
              </Button>
              <Button>
                Translate
              </Button>
              <Button>
                Summary
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
};

export default VideoRoom;