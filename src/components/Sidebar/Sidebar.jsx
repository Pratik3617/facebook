import RssFeedIcon from "@mui/icons-material/RssFeed";
import ChatIcon from "@mui/icons-material/Chat";
import VideocamIcon from "@mui/icons-material/Videocam";
import GroupsIcon from "@mui/icons-material/Groups";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import EventIcon from "@mui/icons-material/Event";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

import "./Sidebar.scss";
import MenuLink from "../MenuLink/MenuLink";

import { useContext } from "react";
import { DarkModeContext } from "../../Context/DarkModeContext";

import {signOut} from "firebase/auth";
import {auth} from "../../firebase.js";

const Sidebar = () => {
  const { dispatch } = useContext(DarkModeContext);
  
  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <MenuLink Icon={<RssFeedIcon className="sidebarIcon" />} text="Feed" />
        <MenuLink Icon={<ChatIcon className="sidebarIcon" />} text="Chats" />
        <MenuLink
          Icon={<VideocamIcon className="sidebarIcon" />}
          text="Videos"
        />
        <MenuLink
          Icon={<GroupsIcon className="sidebarIcon" />}
          text="Friends"
        />
        <MenuLink
          Icon={<BookmarkIcon className="sidebarIcon" />}
          text="Bookmarks"
        />
        <MenuLink
          Icon={<ShoppingCartIcon className="sidebarIcon" />}
          text="Marketplace"
        />
        <MenuLink Icon={<EventIcon className="sidebarIcon" />} text="Events" />

        <span onClick={() => dispatch({ type: "TOGGLE" })}>
          <MenuLink
            Icon={<Brightness4Icon className="sidebarIcon" />}
            text="Themes"
          />
        </span>

        <span onClick={()=>signOut(auth)}>
          <MenuLink
            Icon={<ExitToAppIcon className="sidebarIcon" />}
            text="Logout"
          />
        </span>

        <button className="sidebarButton">Show More</button>
        <hr className="sidebarHr" />        
      </div>
    </div>
  );
};

export default Sidebar;
