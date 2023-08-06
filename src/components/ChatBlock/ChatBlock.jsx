import Input from "../Input/Input";
import "./ChatBlock.scss";
import CallIcon from '@mui/icons-material/Call';
import VideocamIcon from '@mui/icons-material/Videocam';
import InfoIcon from '@mui/icons-material/Info';
import Message from "../Message/Message";
import { useContext, useEffect, useState } from "react";
import {ChatContext} from "../../Context/ChatContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";

const ChatBlock = () => {

  const { data } = useContext(ChatContext);

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const getData = ()=>{
      const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => { console.log("chatId:",data.chatId)
          doc.exists() && setMessages(doc.data().messages);
        });

        return () => {
          unSub();
        };
      }

      data.chatId && getData();
  }, [data.chatId]);



  return (
    <>
      {messages && 
      <div className="chatBlock">
        <div className="chatBlockWrapper">

        <div className="chatTop">
            <div className="chatProfileContainer">
              <img src={data.user?.photoURL} className="chatProfileImg" alt=""/>
              <span className="profileName">{data.user?.displayName}</span>
            </div>

            <div className="ChatIconContainer">
              <span className="chatIconItem">
                <CallIcon className="chaticon"/>
              </span>
              <span className="chatIconItem">
                <VideocamIcon className="chaticon"/>
              </span>
              <span className="chatIconItem" >
                <InfoIcon className="chaticon"/>
              </span>
            </div>
        </div>

        <div className="chatCenter">
            {messages.map((m) => (
              <Message message={m} key={m.id} />
            ))}
        </div>

        <div className="chatBottom">
          <Input/>
        </div>
      </div>
    </div>}
    </>
  )
}

export default ChatBlock