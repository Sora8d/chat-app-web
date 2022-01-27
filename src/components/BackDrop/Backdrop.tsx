import React from "react"
import "./BackDrop.scss"

type backdropProps = {
    turnbackdropoff: () => void
}

function BackDrop({turnbackdropoff}:backdropProps) {
    var style = "backdrop"
    if (window.outerWidth <= 800) {
        style+= "__biggerThan800"
    }
    return (
        <div onClick={turnbackdropoff} className={style}/>
    )
}

export type { backdropProps }
export default BackDrop