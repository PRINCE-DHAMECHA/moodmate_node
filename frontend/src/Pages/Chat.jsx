import ReceivingChat from "../Components/ReceivingChat";
import SendingChat from "../Components/SendingChat";
import MoodMate from "../Components/MoodMate";
import { useState, useRef, useEffect } from "react";
import { BiSend } from "react-icons/bi";
import { useAppContext } from "../Context/appContext";
import React from "react";
import logo from "../utils/logo.png";
import { toast } from "react-hot-toast";

const Chat = ({
  sendMessage,
  messages,
  users,
  closeConnection,
  FindConnection,
}) => {
  const [message, setMessage] = useState("");
  const [isGameOn, setIsGameOn] = useState(<div></div>);
  const scr = useRef(null);
  const inp = useRef(null);
  const {
    yourMood,
    yourName,
    senderMood,
    setSenderMood,
    setYourMood,
    setYourName,
    toastIdUsers,
    setToastIdUsers,
  } = useAppContext();
  useEffect(() => {
    scr.current.scrollIntoView();
  }, [messages]);
  useEffect(() => {
    toast.dismiss(toastIdUsers);
    if (users?.length == 1) {
      setIsGameOn(
        <iframe
          src="/dyno.html"
          title="Dyno App"
          className="fixed bottom-28 w-screen noScroll h-80 z-50"
        ></iframe>
      );
      toast.dismiss(toastIdUsers);
      const tId = toast.loading("Finding Your MoodMate 😉");
      setToastIdUsers(tId);
      FindConnection();
    }
    if (users.length == 2) {
      toast.success(
        `Your MoodMate Found ❤️‍🔥 \nYou're chatting with ${
          users[0].name == yourName ? users[1].name : users[0].name
        }🤩`,
        { id: toastIdUsers }
      );
      setIsGameOn(<div></div>);
    }
    return () => {
      toast.dismiss(toastIdUsers);
    };
  }, [users]);
  const handleClick = (e) => {
    e.preventDefault();
    if (message.length) {
      sendMessage(message);
      inp.current.focus();
    }
    setMessage("");
  };
  const handleKeypress = (e) => {
    if (e.keyCode == 13) {
      handleClick(e);
    }
  };
  useEffect(() => {
    inp.current.focus();
  }, []);
  return (
    <div className="relative h-screen">
      <div className="min-h-[70vh] w-full fixed bg-cyan-100 flex justify-around text-center flex-col ">
        {isGameOn}
        <div className="leave-room text-lg bg-blue-400 text-white border-black rounded-lg h-10 w-20 top-2 right-3 md:right-10 absolute p-[0.35rem]">
          <button
            variant="danger"
            onClick={() => {
              setYourMood("");
              setSenderMood("");
              setYourName("");
              toast.success("You Left The Room 🥲", { id: toastIdUsers });
              toast.dismiss();
              closeConnection();
            }}
          >
            <p className="block m-auto">Leave</p>
          </button>
        </div>
        <div>
          <img
            className="absolute h-12 md:h-16 w-auto top-0 left-0 md:left-6"
            src={logo}
          />
        </div>
        <div></div>
        <div className="mt-12">
          <div className="h-[80vh] overflow-scroll my-6 pb-6 flex flex-col gap-1 z-10">
            {messages.map((m, index) =>
              yourName == m.name ? (
                <SendingChat
                  key={index}
                  gif={yourMood}
                  sender={m.name}
                  msg={m.message}
                />
              ) : "MoodMate" == m.name ? (
                <MoodMate key={index} msg={m.message} />
              ) : (
                <ReceivingChat
                  key={index}
                  gif={senderMood}
                  sender={m.name}
                  msg={m.message}
                />
              )
            )}
            <div ref={scr}></div>
          </div>
          <div className="fixed bottom-2 w-full p-2 md:px-10 h-auto flex gap-4 justify-around text-center">
            <textarea
              className="w-[80%] md:w-[96%] text-xl outline-none  custom-truncate2 h-[2.7rem] resize-none m-auto p-2 rounded-lg px-4 noScroll"
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Message..."
              value={message}
              ref={inp}
              onKeyUp={handleKeypress}
            />
            <button
              className="bg-blue-400 rounded-full h-12 w-12"
              onClick={handleClick}
            >
              <BiSend className="m-auto block w-7 h-7" color="white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
