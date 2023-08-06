import "./StoryCard.scss";

const StoryCard = ({ user }) => {
  return (
    <div className="storyCard">
      <div className="overlay"></div>
      <img src={user.profilePicture} alt="" className="storyProfile" />
      <img src={user.profilePicture} alt="" className="storyBackground" />
      <span className="text">{user.username}</span>
    </div>
  );
};

export default StoryCard;
