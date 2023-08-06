import "./ChatRightbar.scss";
import FacebookIcon from '@mui/icons-material/Facebook';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';

const ChatRightbar = () => {
  return (
    <div className="chatRightbar">
        <div className="chatRightbarWrapper">

          <div className="imgContainer">
            <img src="/assets/profileCover/DefaultProfile.jpg" className="userProfileImg"/>
          </div>

          <div className="iconContainer">
            <div className="profileIcon">
              <FacebookIcon className="icon"/>
            </div>

            <div className="profileIcon">
              <NotificationsIcon className="icon"/>
            </div>

            <div className="profileIcon">
              <SearchIcon className="icon"/>
            </div>
          </div>
        </div>
    </div>
  )
}

export default ChatRightbar