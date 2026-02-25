function ChatItem({ id, name, message, numbers, src, isSelected, onClick }){
    return(
        <div className="chat noselect" onClick={onClick} style={{
            backgroundColor: isSelected ? '#e0e0e0' : 'transparent',
            cursor: 'pointer'
        }}>
            <img src={src}/>
            <div className="chat-container">
                <div>{name}</div>
                <div>{message}</div>
            </div>
            <div className="cols">{numbers}</div>
        </div>
    )
}

function ChatList({ chats, selectedChatId, onSelectChat }){
    return(
        <div id="chats">
            {chats && chats.map((chat) => (
                <ChatItem 
                    key={chat.id} 
                    id={chat.id}
                    name={chat.name} 
                    message={chat.message} 
                    numbers={chat.numbers} 
                    src={chat.src}
                    isSelected={chat.id === selectedChatId}
                    onClick={() => onSelectChat(chat.id)}
                />
            ))}
        </div>
    )
}

function MessageFrom({ name, text, avatar_id, onClick }){
    return(
        <div className="message-content">
            <img src={`Resources/images/persones/${avatar_id}.png`} alt="avatar" className="person-img"/>
            <div className="message-from" onClick={onClick}>
                <div className="person">{name}</div>
                <div className="message-text">{text}</div>
            </div>
        </div>
    )
}

function MessageTo({ text, time, onClick }){
    return(
        <div>
            <div className="message-to" onClick={onClick}>
                <div className="message-text">{text}</div>
                <div className="message-time">{time}</div>
            </div>
        </div>
    )
}

function MessageList({ messages, onMessageClick }){
    return(
        <div id="messages" className="noselect">
            {messages && messages.map((msg) => 
                msg.from === 'me' ? (
                    <MessageTo 
                        key={msg.id}
                        text={msg.text} 
                        time={msg.time} 
                        onClick={(e) => onMessageClick(e, msg.id)}
                    />
                ) : (
                    <MessageFrom 
                        key={msg.id}
                        name={msg.name}
                        text={msg.text} 
                        avatar_id={msg.avatar_id}
                        onClick={(e) => onMessageClick(e, msg.id)}
                    />
                )
            )}
        </div>
    )
}

function ChatHeader({ currentChat }){
    return(
        <div id="chat-name-container">
            <div id="chat-name">
                <button className="chat-name-button noselect">←</button>
                <div>
                    <div className="noselect">{currentChat?.name || 'Select Chat'}</div>
                </div>
            </div>
        </div>
    )
}

function ChatButtons(){
    return(
        <div id="buttons">
            buttons
        </div>
    )
}

export default function Box({ messages, chats, selectedChatId, onMessageClick, onSelectChat }){
    const currentChat = chats.find(chat => chat.id === selectedChatId)
    
    return(
        <>
        <div id="box">
            <div id="fixed">
                Fixed Height
            </div>
        
            <div id="remaining">
                <div>
                    <div id="container">
                        <ChatList chats={chats} selectedChatId={selectedChatId} onSelectChat={onSelectChat}/>
                        <div id="chat">
                            <ChatHeader currentChat={currentChat}/>
                            <MessageList messages={messages} onMessageClick={onMessageClick}/>
                            <ChatButtons/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}