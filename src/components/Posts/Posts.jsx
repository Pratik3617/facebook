import "./Posts.scss";
import { IconButton } from "@mui/material";
import {
  ChatBubbleOutline,
  Favorite,
  MoreVert,
  ShareOutlined,
  ThumbUp,
  ThumbUpAltOutlined,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import TimeAgo from "react-timeago";
import { useContext, useEffect, useState } from "react";
import { addDoc, collection, deleteDoc, doc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { AuthContext } from "../../Context/AuthContext";

const Post = ({ post }) => {

  const [likes,setLikes] = useState([]);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentOpen, setCommentOpen] = useState(false);
  const [input, setInput] = useState("");
  const [commentBoxVsible, setCommentBoxVisible] = useState(false);
  const {currentUser} = useContext(AuthContext);

  useEffect(() => {
    const unSub = onSnapshot(
      collection(db, "posts", post.id, "likes"),
      (snapshot) => setLikes(snapshot.docs)
    );
    return () => {
      unSub();
    };
  }, [post.id]);

  useEffect(() => {
    setLiked(likes.findIndex((like) => like.id === currentUser?.uid) !== -1);
  }, [likes, currentUser.uid]);

  useEffect(() => {
    const unSub = onSnapshot(
      collection(db, "posts", post.id, "comments"),
      (snapshot) => {
        setComments(
          snapshot.docs.map((snapshot) => ({
            id: snapshot.id,
            data: snapshot.data(),
          }))
        );
      }
    );
    return () => {
      unSub();
    };
  }, [post.id]);

  const likePost = async() => {
    if(liked){
      await deleteDoc(doc(db,"posts",post.id,"likes",currentUser.uid));
    }else{
      await setDoc(doc(db,"posts",post.id,"likes",currentUser.uid),{
        userId: currentUser.uid,
      })
    }
  }

  const handleComment = async(e) =>{
    e.preventDefault();

    await addDoc(collection(db,"posts",post.id,"comments"),{
      comment: input,
      displayName: currentUser.displayName,
      photoURL: currentUser.photoURL,
      uid: currentUser.uid,
      timestamp: serverTimestamp(),
    })
    setCommentBoxVisible(false);
    setInput(`What's on your mind ${currentUser.displayName}`);
  }

  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to="/profile/userId">
              <img
                src={post.data.photoURL}
                alt=""
                className="postProfileImg"
              />
            </Link>
            <span className="postUsername">
              @{post.data.displayName.replace(/\s+/g,"").toLowerCase()}
            </span>
            <span className="postDate">
            <TimeAgo
                date={new Date(post.data?.timestamp?.toDate()).toLocaleString()}
              />
            </span>
          </div>

          <div className="postTopRight">
            <IconButton>
              <MoreVert className="postVertButton" />
            </IconButton>
          </div>
        </div>

        <div className="postCenter">
          <div className="postText">{post.data.input}</div>
          <img src={post.data.img} alt="" className="postImg" />
        </div>

        <div className="postBottom">
          <div className="postBottomLeft">
            <Favorite className="bottomLeftIcon" style={{ color: "red" }} />
            <ThumbUp className="bottomLeftIcon" style={{ color: "#011631" }} />
            {likes.length > 0 && 
              <span className="postLikeCounter">{likes.length}</span>
            }
          </div>

          <div className="postBottomRight">
            <span className="postCommentText" onClick={()=>setCommentOpen(!commentOpen)}>
              {comments.length} . comments . share
            </span>
          </div>
        </div>

        <hr className="footerHr" />

        <div className="postBottomFooter">
          <div className="postBottomFooterItem" onClick={(e)=>likePost()}>
            {liked ? (
              <ThumbUp style={{ color: "#011631" }} className="footerIcon" />
            ) : (
              <ThumbUpAltOutlined className="footerIcon" />
            )}
            <span className="footerText">Like</span>
          </div>

          <div className="postBottomFooterItem" onClick={()=>setCommentBoxVisible(!commentBoxVsible)}>
            <ChatBubbleOutline className="footerIcon" />
            <span className="footerText">comment</span>
          </div>

          <div className="postBottomFooterItem">
            <ShareOutlined className="footerIcon" />
            <span className="footerText">share</span>
          </div>
        </div>
      </div>
      {commentBoxVsible && 
        <form onSubmit={handleComment} className="commentBox">
          <textarea className="commentInput" placeholder="write a comment..." value={input} rows={1} style={{resize:"none"}} onChange={(e)=>setInput(e.target.value)}/>
          <button type="submit" disabled={!input} className="commentPost">Comment</button>
        </form>
      }

      {commentOpen > 0 && 
        <div className="comment">
            {comments.sort((a,b)=>b.data.timestamp - a.data.timestamp).map((c)=>(
              <>
                <div className="commentWrapper">
                  <img src={c.data.photoURL} alt="" className="commentProfileImg" />
                  <div className="commentInfo">
                    <span className="commentUsername">{c.data.displayName.replace(/\s+/g,"").toLowerCase()}</span>
                    <p className="commentText">{c.data.comment}</p>
                  </div>
                </div>
              </>
            ))}
        </div>
      }
    </div>
  );
};

export default Post;
