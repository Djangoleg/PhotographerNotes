import React from 'react'
import Button from 'react-bootstrap/Button';
import Moment from 'moment';
import auth from "./Authentication";

const PhotoNotesItem = ({note}) => {
    const isAuthenticated = auth.isAuthenticated();
    return (
        <div className="row">
            <div className="container-sm">
                <div className="col-sm">
                    <div className="row mt-4 mb-4">
                        <div className="col"><strong>{note.title}</strong></div>
                        <div className="col-auto">{Moment(note.created).format('LLL')}</div>
                    </div>
                    <img className="rounded mx-auto d-block blog-img" src={note.image} alt=''/>
                    <p className="text-left">{note.photo_comment}</p>
                    { isAuthenticated ? <EditButton noteId={note.id} /> : null }
                </div>
            </div>
        </div>
    )
}

const EditButton = ({noteId}) => {
    return (
         <div className="button-tar">
            <Button href={`/note/${noteId}/`} variant="info" size="lg">
                Edit
            </Button>
        </div>
    )
}

const Blog = ({notes}) => {
    return (
        <div>
            {notes.map((note) => <PhotoNotesItem key={note.id} note={note}/>)}
        </div>
    )
}
export default Blog
