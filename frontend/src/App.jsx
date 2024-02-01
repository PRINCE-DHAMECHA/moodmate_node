import "./App.css";
import Profile from "./Pages/Profile";
import Chat from "./Pages/Chat";
import { useState } from "react";
import io from "socket.io-client";
import toast, { Toaster } from "react-hot-toast";
import { useAppContext } from "./Context/appContext";
import Privacy from "./Components/Privacy";

function App() {
  let toastId;
  const [isJoined, setIsJoined] = useState(false);
  const [connection, setConnection] = useState(null);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const { setIsEnable, privacy, isSent, setIsSent } = useAppContext();
  const joinRoom = async (user, userWant, userIs) => {
    let con = io("http://localhost:5000", {
      transports: ["websocket"],
    });
    setConnection(con);
    toastId = toast.loading("Please wait 😉");
    try {
      con.on("ReceiveMessage", ({ name, message }) => {
        setMessages((messages) => [...messages, { name, message }]);
      });

      con.on("UsersInRoom", (users) => {
        const arrayUsers = [];
        arrayUsers.push(users?.connectionUser);
        if (users?.user) {
          arrayUsers.push(users.user);
        }
        setUsers(arrayUsers);
      });
      toast.loading("Crunching your MoodMate 😋", {
        id: toastId,
      });
      con.emit("JoinRoom", {
        name: user,
        userIs,
        userWant,
      });
      toast.success("You Joined The Room 😁", {
        id: toastId,
      });
      setIsJoined(true);
    } catch (e) {
      toast.error("Something Went Wrong 😣, Please Try Again! 🥲", {
        id: toastId,
      });
    }
    setIsEnable(true);
  };

  const sendMessage = async (message) => {
    if (isSent) {
      setIsSent(false);
      try {
        toastId = toast.loading("Sending Your Message 🫡");
        connection.emit("SendMessage", message);
        toast.success("Sent 🕊️", {
          id: toastId,
        });
      } catch (e) {
        console.log(e);
      }
      setIsSent(true);
    }
  };

  const FindConnection = async () => {
    try {
      connection.emit("CheckAvailable");
    } catch (e) {
      console.log(e);
    }
  };

  const closeConnection = async () => {
    try {
      setIsJoined(false);
      setMessages([]);
      setUsers([]);
      setConnection(null);
      connection.disconnect();
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div className="App">
      {privacy && <Privacy />}
      <Toaster position="top-center" reverseOrder={false} />
      {!isJoined ? (
        <Profile joinRoom={joinRoom} />
      ) : (
        <Chat
          sendMessage={sendMessage}
          messages={messages}
          users={users}
          closeConnection={closeConnection}
          FindConnection={FindConnection}
        />
      )}
    </div>
  );
}

export default App;
