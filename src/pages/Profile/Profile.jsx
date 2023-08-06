import "./Profile.scss";
import { useContext } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import Rightbar from "../../components/Rightbar/Rightbar";
import ProfileRightBar from "../../components/ProfileRightBar/ProfileRightBar";
import UsersPosts from "../../components/UsersPosts/UsersPosts";
import { AuthContext } from "../../Context/AuthContext";

const Profile = () => {
  const {currentUser} = useContext(AuthContext);
  return (
    <div className="profile">
      <Navbar/>
      <div className="profileWrapper">
        <Sidebar/>
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              <img
                src="/assets/profileCover/profilecover.jpg"
                alt=""
                className="profileCoverImg"
              />

              <img
                src={currentUser.photoURL}
                alt=""
                className="profileUserImg"
              />
            </div>

            <div className="profileInfo">
              <h4 className="profileInfoName">{currentUser.displayName}</h4>
              <span className="profileInfoDesc">Hi Friends!</span>
            </div>
          </div>
          <div className="profileRightBottom">
            <UsersPosts/>
            <Rightbar profile={<ProfileRightBar />} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
