import { useContext, useEffect, useState } from "react";
import "./UsersPosts.scss";
import Share from "../Share/Share";
import Stories from "../Stories/Stories";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import { AuthContext } from "../../Context/AuthContext";
import TimeAgo from "react-timeago";
import { IconButton } from "@mui/material";
import { MoreVert } from "@mui/icons-material";
import { Link } from "react-router-dom";

const UsersPosts = () => {
    const {currentUser} = useContext(AuthContext);
    const [usersPosts, setUsersPosts] = useState([]);

    useEffect(() => {
        const getUsersPosts = ()=>{
            const unSub = onSnapshot(doc(db,"usersPosts",currentUser.uid),(doc)=>{
              doc.exists() && setUsersPosts(doc.data().messages)
            })
          
            return () => {
              unSub();
            }
        }
        currentUser.uid && getUsersPosts();
    }, [currentUser.uid])
    

  return (
    <div className="feedUsersPost">
        <div className="feedUsersPostWrapper">
            <Stories/>
            <Share />

            {usersPosts.sort((a,b)=>b.timestamp - a.timestamp).map((m)=>(
                <div className="usersPost" key={m.id}>
                    <div className="usersPostWrapper">
                        <div className="postTop">
                            <div className="postTopLeft">
                                <Link to="/profile/userId">
                                <img
                                    src={m.photoURL}
                                    alt=""
                                    className="postProfileImg"
                                />
                                </Link>
                                <span className="postUsername">
                                @{m.displayName.replace(/\s+/g,"").toLowerCase()}
                                </span>
                                <span className="postDate">
                                <TimeAgo
                                    date={new Date(m.data?.timestamp?.toDate()).toLocaleString()}
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
                            <div className="postText">{m.input}</div>
                            <img src={m.img} alt="" className="postImg" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
  )
}

export default UsersPosts