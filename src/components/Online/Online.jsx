import "./Online.scss";
import { AuthContext } from "../../Context/AuthContext";
import { useContext } from "react";


const Online = ({ onlineuser }) => {
  const {currentUser} = useContext(AuthContext);

  if(currentUser.email !== onlineuser.data.email){
    return (
      <div className="online">
      <li className="rightbarFriend">
        <div className="rightbarProfileImgContainer">
          
          <img
            src={onlineuser.data.photoURL}
            alt=""
            className="rightbarProfileImg"
          />
          <span className="rightbarOnline"></span>
         
        </div>
        <span className="rightbarUsername">{onlineuser.data.displayName}</span>
      </li>
    </div>
    )
  }
};

export default Online;
