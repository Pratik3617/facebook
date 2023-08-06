import { useEffect, useState } from "react";
import "./RightBarHome.scss";
import Online from "../Online/Online";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";


const RightBarHome = () => {
  const [Users, setUsers] = useState([]);

  useEffect(() => {
    const unSub = onSnapshot(collection(db, "users"), (snapshot) => {
      setUsers(snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() })));
    });
    
    return () => {
      unSub();
    };
  }, []);


  return (
    <div className="rightbarhome">
      
      <div className="birthdayContainer">
        <img
          src="/assets/birthdaygifts/gift.png"
          alt=""
          className="birthdayImg"
        />
        <span className="birthdayText">
          <b>Harry</b> and <b>5 other friends</b> have a birthday today
        </span>
      </div>
      <img src="/assets/ads/adv.jpg" alt="" className="rightbarAdvert" />
      <span className="rightbarTitle">Online Friends</span>
      <ul className="rightbarFriendList">
        {Users.map((u) => (
            <Online key={u.id} onlineuser={u} />
        ))}
      </ul>
    </div>
  );
};

export default RightBarHome;
