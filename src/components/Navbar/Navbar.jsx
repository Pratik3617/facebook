import React, { useContext, useEffect, useRef, useState } from "react";
import "./Navbar.scss";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Link } from "react-router-dom";
import {AuthContext} from "../../Context/AuthContext";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import { PersonAddAlt1Outlined } from "@mui/icons-material";
import ChatModal from "../Modal/ChatModal";


const Navbar = () => {

  const {currentUser} = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);

  const [ismodalOpen,setModalOpen] = useState(false);
  const dialogRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target)) {
        setModalOpen(false)
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleModal = () =>{
    setModalOpen(!ismodalOpen);
  }


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

  return (
    
    <div className="navbarContainer">
      
      {ismodalOpen && <ChatModal open={ismodalOpen} onClose={handleModal} dialogRef={dialogRef}/>}

      <div className="navbarLeft">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">faceBook</span>
        </Link>
      </div>

      <div className="navbarCenter">
        <div className="searchBar">
          <SearchIcon className="searchIcon" />
          <input
            type="text"
            placeholder="Search Here..."
            className="searchInput"
            onKeyDown={handleKey}
            onChange={(e) => setUsername(e.target.value)}
          />
          {err && <span className="userSearchError">User not found!</span>}
        {username && user && (
          <div className="userSearch" >
            <Link to={`/profile/${user.displayName}`} style={{textDecoration:"none",display:"flex",alignItems:"center"}}>
            <img src={user.photoURL} alt="" />
            <div className="userInfo">
              <span >{user.displayName}</span>
            </div>
            </Link>
            <button><PersonAddAlt1Outlined className="userAddIcon"/>Add Friend</button>
          </div>
        )}
        </div>
        
      </div>

      <div className="navbarRight">
        <div className="navbarLinks">
          <span className="navbarLink">Homepage</span>
          <span className="navbarLink">Timeline</span>
        </div>

        <div className="navbarIcons">
          <div className="navbarIconItem">
            <PersonIcon className="navbarIcon" />
            <span className="navbarIconBadge">2</span>
          </div>
          
          
            <div className="navbarIconItem" onClick={handleModal}>
              <ChatBubbleIcon className="navbarIcon" style={{position:'relative'}}/>
              <span className="navbarIconBadge">10</span>
            </div>


          <div className="navbarIconItem">
            <NotificationsIcon className="navbarIcon" />
            <span className="navbarIconBadge">7</span>
          </div>
          <Link to={`/profile/${currentUser.displayName}`}>
            <img
              src={currentUser.photoURL}
              alt="user"
              className="navbarImg"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
