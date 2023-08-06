import "./userChat.scss";

const UserChat = ({searched, user, chat, handleSelect}) => {

  return (
    <>
      {user && 
        <div className={`userChat ${searched ? "searched" : ""}`} onClick={handleSelect}>
          <img src={user.photoURL} alt='' className='chatImage'/>
          <div className='chatInfo'>
              <span className='messengerName'>{user.displayName}</span>
          </div>
        </div>}


      {chat && 
        <div className={`userChat ${searched ? "searched" : ""}`} onClick={handleSelect}>
            <img src={chat[1].userInfo.photoURL} alt='' className='chatImage'/>
            <div className='chatInfo'>
                <span className='messengerName'>{chat[1].userInfo.displayName}</span>
                <div className='chatMessage'>{chat[1].lastMessage?.text.length > 20 ? chat[1].lastMessage?.text.substring(0, 20) + "..." : chat[1].lastMessage?.text}</div>
            </div>
        </div>}
    </>
  )
}

export default UserChat