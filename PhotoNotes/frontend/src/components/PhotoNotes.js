import React from 'react'

const PhotoNotesItem = ({note}) => {
    return (
        <div className="col-sm">
            <img className="index-img" src={note.image}/>
        </div>
    )
}

const PhotoNotesList = ({notes}) => {
    return (
        <div className="row">
            {notes.map((note) => <PhotoNotesItem key={note.id} note={note}/>)}
        </div>
    )
}
export default PhotoNotesList
