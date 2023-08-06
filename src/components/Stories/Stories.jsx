import "./Stories.scss";
import StoryCard from "../StoryCard/StoryCard";
import { Users } from "../../data";
import { AuthContext } from "../../Context/AuthContext";
import { useContext } from "react";

const Stories = () => {
  const {currentUser} = useContext(AuthContext);
  return (
    <div className="stories">
      <div className="storyCard">
        <div className="overlay"></div>
        <img src={currentUser.photoURL} alt="" className="storyProfile" />
        <img
          src={currentUser.photoURL}
          alt=""
          className="storyBackground"
        />
        <img src="/assets/person/upload.png" alt="" className="storyAdd" />
        <span className="text">{currentUser.displayName}</span>
      </div>
      {Users.map((u) => (
        <StoryCard key={u.id} user={u} />
      ))}
    </div>
  );
};

export default Stories;
