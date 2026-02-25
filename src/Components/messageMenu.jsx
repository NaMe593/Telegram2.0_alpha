import { useState } from "react"

function details(id, date, handler){
    return(
        <>
        <div id="details">
                                <div className="details-info">
                                    <button id="details-button-back" onClick={handler}>←</button>
                                    <div className="details-info1">
                                        <img src="Resources/images/info.png" alt="info" width="20px" height="20px"/>
                                        <div className="details-content">
                                            ID<div id="id">1128 {id} </div>
                                        </div>
                                    </div>
                                    <div className="details-info1">
                                        <img src="Resources/images/calendar.png" alt="info" width="20px" height="20px"/>
                                <div className="details-content">
                                    Date<div id="date">16.10.2025 at 18:35:00 {date}</div>
                            </div>
                        </div>
                    </div>
                </div>
        </>
    )
}

function MenuBtn(handler){

    return(
        <>
            <div id="message-reactions">
                            <div className="reactions">

                            </div>
                            <button>Reply</button>
                            <button>Copy</button>
                            <button>Mail</button>
                                <button>Pin</button>
                                <button>Translate</button>
                                <button>Edit</button>
                                <button>Delete</button>
                                <button onClick={handler}>Details</button>
                                
                            </div>
        </>
    )
}


export default function Menu({id, date, hidden, style}){
    const [ showDetails, setShowDetails ] = useState(false)

    function handler(){setShowDetails(!showDetails)}
    
    const menuStyle = {...style}
    
    return (
        <>
        <div id="menu" hidden={hidden} style={menuStyle}>
            <div style={{position: "relative"}}>
                {showDetails ? details(id, date, handler) : MenuBtn(handler)}
            </div>
        </div>
        </>
    )
}