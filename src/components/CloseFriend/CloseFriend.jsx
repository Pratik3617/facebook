import "./CloseFriend.scss";

const CloseFriend = ({ img, Name }) => {
  return (
      <div className="profileRightbarFollowing">
      <img src={img} alt="" className="profileRightbarFollowingImg" />
      <span className="profileRightbarFollowingName">{Name}</span>
    </div>
  );
};

export default CloseFriend;
