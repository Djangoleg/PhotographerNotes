import React from 'react';
import Popup from "reactjs-popup";

const LikesPopup = ({note, setLikeOrUnlike}) => {

    return (
        note.likes.length > 0 ?
            (
                <Popup
                    trigger={
                        <input type="button"
                               className="btn btn-link text-decoration-none"
                               value={`Likes ${note.likes_number}`}
                               onClick={() => {
                                   setLikeOrUnlike(note.id);
                               }}
                        />
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
                <input type="button"
                       className="btn btn-link text-decoration-none"
                       value={`Likes ${note.likes_number}`}
                       onClick={() => {
                           setLikeOrUnlike(note.id);
                       }}
                />
            )
    )
}

export default LikesPopup