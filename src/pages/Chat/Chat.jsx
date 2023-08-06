import Navbar from '../../components/Navbar/Navbar';
import ChatSidebar from "../../components/ChatSidebar/ChatSidebar";
import ChatBlock from "../../components/ChatBlock/ChatBlock";
import "./Chat.scss";
import ChatRightbar from '../../components/ChatRightbar/ChatRightbar';

const Chat = () => {
  return (
    <div className="chatHome">
        <Navbar/>
        <div className="chatContainer">
            <ChatSidebar />
            <ChatBlock />
            <ChatRightbar/>
        </div>
    </div>
  )
}

export default Chat