import { useContext, useEffect, useState } from "react";
import Search from "../Search/Search";
import UserChat from "../UserChat/UserChat";
import "./sidebarChat.scss";
import { AuthContext } from "../../Context/AuthContext";
import {ChatContext} from "../../Context/ChatContext";
import { db } from "../../firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const ChatSidebar = () => {
  const [chats, setChats] = useState([]);

  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);
  const navigate = useNavigate();

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "usersChats", currentUser.uid), (doc) => {
        setChats(doc.data());
      });

      return () => {
        unsub();
      };
    };

    currentUser.uid && getChats();
  }, [currentUser.uid]);

  const handleSelect = (u) => {
    dispatch({ type: "CHANGE_USER", payload: u });
    navigate(`/chat/${u.displayName}`);
  };

  return (
    <div className="chatSidebar">
      <div className="chatSidebarWrapper">
        <Search/>

        {chats && Object.entries(chats)?.sort((a,b)=>b[1].date - a[1].date).map((chat)=>(
          <UserChat key={chat[0]} handleSelect={()=> handleSelect(chat[1].userInfo)} chat={chat}/>
        ))} 
      </div>
    </div>
  )
}

export default ChatSidebar