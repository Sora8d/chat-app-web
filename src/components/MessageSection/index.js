import React from 'react'
import './MessageSection.scss'
import { BsChevronDown } from "react-icons/bs";
import { RiSearchLine } from "react-icons/ri";



function MessageSection() {
    return (
        <div className='messages'>
            <div className="messages__header">
                <div className="messages__header__title">
                    <h2 className="messages__header__title__h2">
                        Messages
                    </h2>
                    <span className="messages__header__title__dropdownIcon">
                        <BsChevronDown size={12} />
                    </span>
                    <span className="messages__header__title__badge">
                        12
                    </span>
                </div>
                <button className="messages__header__plusButton">
                    +
                </button>
            </div>
            <div className="messages__searchBar">
                <div className="messages__searchBar__lupa">
                    <RiSearchLine />
                </div>
                <input type="search" placeholder='Search messages' />
            </div>
        </div>
    )
}

export default MessageSection
