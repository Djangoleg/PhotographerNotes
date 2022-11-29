import React, {useState} from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Moment from 'moment';
import auth from "./Authentication";
import appPath from "./AppPath";
import axios from "axios";
import url from "./AppURL";

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
                    {isAuthenticated ? <DeleteButton note={note}/> : null}
                    {isAuthenticated ? <EditButton noteId={note.id}/> : null}
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

const DeleteButton = ({note}) => {
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);
    const handleDelete = () => {
        let headers = auth.getHeaders();
        axios.delete(`${url.get()}/api/notes/${note.id}/`,
            {
                headers: headers,
            }).then(() => {
            setShow(false);
            window.location.reload();
        }).catch(error => {
            setShow(false);
            console.log(error);
            alert('Error change or create note!');
        });
    }

    return (
        <div>
            <div className="button-tar">
                <Button variant="info" size="lg" onClick={handleShow}>
                    Delete
                </Button>
            </div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Deleting a note</Modal.Title>
                </Modal.Header>
                <Modal.Body>Note "{note.title}" will be deleted!</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

const CreateButton = () => {
    return (
        <div className="button-tar">
            <br/>
            <Button href={appPath.createNote} variant="info" size="lg">
                Create note
            </Button>
            <br/>
        </div>
    )
}

const Blog = ({notes}) => {
    const isAuthenticated = auth.isAuthenticated();
    return (
        <div>
            {isAuthenticated ? <CreateButton/> : null}
            {notes.map((note) => <PhotoNotesItem key={note.id} note={note}/>)}
        </div>
    )
}
export default Blog
