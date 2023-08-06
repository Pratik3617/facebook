import { EmojiEmotionsOutlined } from "@mui/icons-material";
import "./Input.scss";
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import CollectionsOutlinedIcon from '@mui/icons-material/CollectionsOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import EmojiPicker from "@emoji-mart/react";
import { useContext, useState } from "react";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import {db , storage} from "../../firebase";
import { Timestamp, arrayUnion, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import {AuthContext} from "../../Context/AuthContext";
import {ChatContext} from "../../Context/ChatContext";
const Input = () => {

  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [showEmojis, setShowEmojis] = useState(false);

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const addEmoji = (e) => {
    let sym = e.unified.split("-");
    let codesArray = [];

    sym.forEach((elm)=>codesArray.push("0x" + elm));
    let emoji = String.fromCodePoint(...codesArray);

    setText(text + emoji);
  }

  const handleSend = async () => {
    if (img) {
      const storageRef = ref(storage, "chatsImages/" + uuid());

      uploadBytesResumable(storageRef, img).then(()=>{
        getDownloadURL(storageRef).then(async (downloadURL) => {
          await updateDoc(doc(db, "chats", data.chatId), {
            messages: arrayUnion({
              id: uuid(),
              text,
              senderId: currentUser.uid,
              date: Timestamp.now(),
              img: downloadURL,
            }),
          });
        });
      });
    } else {
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
    }
    await updateDoc(doc(db, "usersChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    await updateDoc(doc(db, "usersChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    setText("");
    setImg(null);
    setShowEmojis(false);
  };

  return (
    <div className="input">
        <AddBoxOutlinedIcon className="inputIcon"/>
        <label htmlFor="file" >
            <CollectionsOutlinedIcon className="inputIcon" style={{color:"rgb(46 183 46)"}}/>
            <input
              type="file"
              id="file"
              style={{ display: "none" }}
              accept=".png,.jpeg,.jpg"
              onChange={(e) => setImg(e.target.files[0])}
            />
        </label>

        <div onClick={()=>setShowEmojis(!showEmojis)} className="shareOption">
          <EmojiEmotionsOutlined
            className="inputIcon"
            style={{ color: "#efef21" }}
          />
        </div>
        
        <input type="text" placeholder="Message..." value={text} onChange={(e)=>setText(e.target.value)}/>
        <SendOutlinedIcon className="inputIconSend" onClick={handleSend}/>

        {
          showEmojis && 
          <div className="emoji">
            <EmojiPicker onEmojiSelect={addEmoji}/>
          </div>
        }
    </div>
  )
}

export default Input