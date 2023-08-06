import "./Rightbar.scss";
import ProfileRightBar from "../ProfileRightBar/ProfileRightBar";
import RightBarHome from "../RightBarHome/RightBarHome";

const Rightbar = ({ profile }) => {
  return (
    <div className="rightBar">
      <div className="rightbarWrapper">
        {profile ? <ProfileRightBar /> : <RightBarHome />}
      </div>
    </div>
  );
};

export default Rightbar;
