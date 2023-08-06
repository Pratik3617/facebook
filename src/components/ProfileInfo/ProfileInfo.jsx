import "./ProfileInfo.scss";

const ProfileInfo = ({ Key, value }) => {
  return (
    <div className="profileRightbarInfoItem">
      <span className="profileRightbarInfoKey">{Key}</span>
      <span className="profileRightbarInfoValue">{value}</span>
    </div>
  );
};

export default ProfileInfo;
