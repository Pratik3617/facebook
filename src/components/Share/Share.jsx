import {
  Close,
  EmojiEmotionsOutlined,
  PermMedia,
  VideoCameraFront,
} from "@mui/icons-material";
import "./Share.scss";
import { useContext, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../firebase";
import {v4 as uuid} from "uuid";
import { Timestamp, addDoc, arrayUnion, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import EmojiPicker from "@emoji-mart/react";

const Share = () => {
  const {currentUser} = useContext(AuthContext)
  const [input,setInput] = useState("");
  const [img, setImg] = useState(null);
  // const [error, setError] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);

  const addEmoji = (e) => {
    let sym = e.unified.split("-");
    let codesArray = [];

    sym.forEach((elm)=>codesArray.push("0x" + elm));
    let emoji = String.fromCodePoint(...codesArray);

    setInput(input + emoji);
  }

  const handlePost = async() =>{
    if(img){
      const storageRef = ref(storage, "Posts/" + uuid());
      
      uploadBytesResumable(storageRef, img).then(()=>{
        getDownloadURL(storageRef).then(async(downloadURL) => {
          await addDoc(collection(db, "posts"), {
            uid: currentUser.uid,
            photoURL: currentUser.photoURL,
            displayName: currentUser.displayName,
            input,
            img: downloadURL,
            timestamp: serverTimestamp(),
          });

          await updateDoc(doc(db,"usersPosts",currentUser.uid), {
            messages: arrayUnion({
              id: uuid(),
              uid: currentUser.uid,
              photoURL: currentUser.photoURL,
              displayName: currentUser.displayName,
              input,
              img: downloadURL,
              timestamp: Timestamp.now(),
            })
          });
        });
      });
      
    }else{
      await addDoc(collection(db, "posts"), {
        uid: currentUser.uid,
        photoURL: currentUser.photoURL,
        displayName: currentUser.displayName,
        input,
        timestamp: serverTimestamp(),
      });

      await updateDoc(doc(db,"usersPosts",currentUser.uid), {
        messages: arrayUnion({
          id: uuid(),
          uid: currentUser.uid,
          photoURL: currentUser.photoURL,
          displayName: currentUser.displayName,
          input,
          timestamp: Timestamp.now(),
        })
      });
    }
    setInput("");
    setImg(null);
    setShowEmojis(false);
  };

  const handleKey = (e) => {
    e.code === "Enter" && handlePost()
  }

  const removeImg = () => {
    setImg(null);
  };

  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
          <img
            src={currentUser.photoURL}
            alt=""
            className="shareProfileImg"
          />
          <textarea
            rows={2}
            style={{resize:"none",overflow:"hidden"}}
            type="text"
            placeholder={"What's on your mind "+ currentUser.displayName + "?"}
            value={input}
            className="shareInput"
            onChange={(e)=>setInput(e.target.value)}
            onKeyDown={handleKey}
          />
        </div>

        <hr className="shareHr" />

        {img && (
          <div className="shareImgContainer">
            <img src={URL.createObjectURL(img)} alt="" className="shareImg" />
            <Close className="shareCancelImg" onClick={removeImg} />
          </div>
        )}

        <div className="shareBottom">
          <div className="shareOptions">
            <div className="shareOption">
              <VideoCameraFront
                className="shareIcon"
                style={{ color: "#bb0000f2" }}
              />
              <span className="shareOptionText">Live Video</span>
            </div>

            <label htmlFor="file" className="shareOption">
              <PermMedia className="shareIcon" style={{ color: "#2e0196f1" }} />
              <span className="shareOptionText">Photo/Video</span>
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
                className="shareIcon"
                style={{ color: "#efef21" }}
              />
              <span className="shareOptionText">Feelings/Activity</span>
            </div>
          </div>
        </div>
        {
          showEmojis && 
          <div className="emoji">
            <EmojiPicker onEmojiSelect={addEmoji}/>
          </div>
        }
      </div>
    </div>
  );
};

export default Share;
