import "./ProfileRightBar.scss";
import ProfileInfo from "../ProfileInfo/ProfileInfo";
import CloseFriend from "../CloseFriend/CloseFriend";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";

const ProfileRightBar = () => {

  const {currentUser} = useContext(AuthContext);
  const [getUserInfo, setUserInfo] = useState({});

  const [Users, setUsers] = useState([]);

  useEffect(() => {
    const unSub = onSnapshot(collection(db, "users"), (snapshot) => {
      setUsers(snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() })));
    });
    
    return () => {
      unSub();
    };
  }, []);

  useEffect(()=>{
    const getInfo = ()=>{
      const unSub = onSnapshot(doc(db,"users",currentUser.uid),(doc)=>{
        setUserInfo(doc.data());
      })
      return ()=>{
        unSub();
      }
    }
    currentUser.uid && getInfo();
  },[currentUser.uid])

  return (
    <div className="profileRightbar">
      <div className="profileRightbarHeading">
        <span className="profileRightbarTitle">User Information</span>
        <Link to={`/profile/${currentUser.displayName}/edit`} style={{ textDecoration: "none" }}>
          <span className="editButton">Edit Profile</span>
        </Link>
      </div>

      <div className="profileRightbarInfo">
        <ProfileInfo Key="Email:" value={getUserInfo.email ? getUserInfo.email : currentUser.email} />
        <ProfileInfo Key="Phone Nubmer:" value={getUserInfo.phone} />
        <ProfileInfo Key="Age:" value={getUserInfo.age} />
        <ProfileInfo Key="Country:" value={getUserInfo.country} />
        <ProfileInfo Key="Relationship:" value={getUserInfo.relationship} />
      </div>

      <h4 className="profileRightbarTitle">CLose Friends</h4>
      <div className="profileRightbarFollowings">
        
        {Users.map((u) => (
            <CloseFriend key={u.id} img={u.data.photoURL} Name={u.data.displayName} />
        ))}
      </div>
    </div>
  );
};

export default ProfileRightBar;
