import React from 'react';
import Popup from "reactjs-popup";

const LikesPopup = ({note, setLikeOrUnlike}) => {

    return (
        note.likes.length > 0 ?
            (
                <Popup
                    trigger={
                        <a className="d-inline-block"
                           onClick={() => {
                               setLikeOrUnlike(note.id);
                           }}
                        > Likes {note.likes_number}</a>
                    }
                    arrow={true}
                    on={['hover', 'focus']}
                    position="top center">
                    {note.likes.map((user, i) => {
                        return (
                            <div key={i}>
                                <a href={`/profile/view/${user.split('|')[0]}`}>{user.split('|')[1]}</a>
                            </div>
                        );
                    })}
                </Popup>
            ) :
            (
                <a className="d-inline-block"
                   onClick={() => {
                       setLikeOrUnlike(note.id);
                   }}
                > Likes {note.likes_number}</a>
            )
    )
}

export default LikesPopup