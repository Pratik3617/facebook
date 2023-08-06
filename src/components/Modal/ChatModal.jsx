import { useContext, useState , useEffect} from "react";
import { db } from "../../firebase";
import { collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc, onSnapshot} from "firebase/firestore";
import { EditNoteOutlined, VideoCameraBackOutlined } from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import OpenInFullIcon from '@mui/icons-material/OpenInFull';

import "./ChatModal.scss";
import UserChat from "../UserChat/UserChat";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";
import { ChatContext } from "../../Context/ChatContext";

const ChatModal = ({dialogRef, open, onClose}) => {

    const [username, setUsername] = useState("");
    const [user, setUser] = useState(null);
    const [err, setErr] = useState(false);
    const { currentUser } = useContext(AuthContext);
    const [chats, setChats] = useState([]);

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

    const handleSearch = async () => {
        const q = query(
          collection(db, "users"),
          where("displayName", "==", username)
        );
    
        try {
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            setUser(doc.data());
          });
        } catch (err) {
          setErr(true);
        }
      };

      const handleKey = (e) => {
        e.code === "Enter" && handleSearch();
      };

      

      const handleSelect = async (c) => {

        //check whether the group(chats in firestore) exists, if not create
        const combinedId =
          currentUser.uid > user.uid
            ? currentUser.uid + user.uid
            : user.uid + currentUser.uid;
        try {
          const res = await getDoc(doc(db, "chats", combinedId));
    
          if (!res.exists()) {
            //create a chat in chats collection
            await setDoc(doc(db, "chats", combinedId), { messages: [] });
    
            //create user chats
            await updateDoc(doc(db, "usersChats", currentUser.uid), {
              [combinedId + ".userInfo"]: {
                uid: user.uid,
                displayName: user.displayName,
                photoURL: user.photoURL,
              },
              [combinedId + ".date"]: serverTimestamp(),
            });
    
            await updateDoc(doc(db, "usersChats", user.uid), {
              [combinedId + ".userInfo"]: {
                uid: currentUser.uid,
                displayName: currentUser.displayName,
                photoURL: currentUser.photoURL,
              },
              [combinedId + ".date"]: serverTimestamp(),
            });
            
          }
          navigate(`/chat/${c.displayName}`)
        } catch (err) {}
        setUser(null)
        setUsername("")
      }

      
    
      const handleChatSelect = (u) => {
        dispatch({ type: "CHANGE_USER", payload: u });
        navigate(`/chat/${u.displayName}`)
      };


  return (
    <dialog ref={dialogRef} open={open} onClose={onClose} className="dialogChat">

        <div className="top">
            <h2>Chats</h2>
            <div className="topIcons">
            <VideoCameraBackOutlined className="icon"/>
            <EditNoteOutlined className="icon"/>
            <Link to="/Chat">
              <OpenInFullIcon className="icon" style={{fontSize:"2.5rem",color:"#222"}} onClick={onClose}/>
            </Link>

            </div>
        </div>

        <div className="center">
            <div className="searchChats">
                <SearchIcon className="messengerIcon"/>
                <input
                type="text"
                placeholder="Search Messenger"
                className="messageSearchInput"
                onKeyDown={handleKey}
                onChange={(e)=> setUsername(e.target.value)}
                value={username}
                />
            </div>
        </div>

        {err && <span>User Not Found!</span>}

        {user && (
         
            <UserChat searched={true} user={user} handleSelect={()=>handleSelect(user)}/>
          
        )}


        <div className="bottom">        
          {chats && Object.entries(chats)?.sort((a,b)=>b[1].date - a[1].date).map((chat) => (
                <UserChat key={chat[0]} handleSelect={()=> handleChatSelect(chat[1].userInfo)} chat={chat}/>
          ))} 
        </div>
        
    </dialog>
  )
}

export default ChatModal