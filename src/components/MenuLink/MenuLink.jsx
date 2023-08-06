import { useContext } from "react";
import "./MenuLink.scss";
import {AuthContext} from "../../Context/AuthContext.js";

const MenuLink = ({ Icon, text }) => {
  const {currentUser} = useContext(AuthContext);
  return (
    <div className="menuLink">
      {Icon}
      <span className="menuLinkText">{text}</span>
      <span className="menuLinkTextName">{text === "Logout" && `(${currentUser.displayName})`}</span>
    </div>
  );
};

export default MenuLink;
