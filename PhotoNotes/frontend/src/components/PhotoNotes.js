import React from 'react'

const PhotoNotesItem = ({note}) => {
    return (
        <div className="row">
            <div className="container-sm">
                <div className="col-sm">
                    <p className="text-center mt-4"><b>{note.title}</b></p>
                    <img className="rounded mx-auto d-block blog-img" src={note.image} alt=''/>
                    <p className="text-left">{note.photo_comment}</p>
                    <div className="text-right">
                        <a className="bottom" href="#">Edit</a>
                    </div>
                </div>
            </div>
        </div>
    )
}

const PhotoNotesList = ({notes}) => {
    return (
        <div>
            {notes.map((note) => <PhotoNotesItem key={note.id} note={note}/>)}
        </div>
    )
}
export default PhotoNotesList
