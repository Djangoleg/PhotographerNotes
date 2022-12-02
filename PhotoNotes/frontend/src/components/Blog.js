import React, {useState} from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Moment from 'moment';
import auth from "./Authentication";
import appPath from "./AppPath";
import axios from "axios";
import url from "./AppURL";
import '../blog.css';

const PhotoNotesItem = ({note, startId}) => {

    const isAuthenticated = auth.isAuthenticated();

    return (
        <div className="row no-gutters-lg">
            <div className="col-lg-8 mb-5 mb-lg-0">
                <div className="row">
                    <div className="col-12 mb-4">
                        <article className="card article-card">
                            <h2 className="h1">{note.title}</h2>
                            <div className="card-image">
                                <div className="post-info">
                                    <span className="text-uppercase">{Moment(note.created).format('LLL')}</span>
                                </div>
                                <img loading="lazy" decoding="async" src={note.image}
                                     alt="Post Image" className="w-100"/>
                            </div>
                            <div className="card-body px-0 pb-1">
                                <ul className="post-meta mb-2">
                                    <li><a href="#!">portrait</a>
                                        <a href="#!">live</a>
                                    </li>
                                </ul>

                                <p className="card-text m-3">{note.photo_comment}</p>
                            </div>
                            <div className="d-flex justify-content-between">
                                {isAuthenticated ? <DeleteButton note={note}/> : null}
                                {isAuthenticated ? <EditButton noteId={note.id}/> : null}
                            </div>
                        </article>
                    </div>
                </div>

            </div>
            {(note.id === startId) ? <Categories/> : null}
        </div>
    );
}

const EditButton = ({noteId}) => {
    return (
        <div className="d-inline-block">
            <Button type="submit" className="btn btn-primary" href={`/note/${noteId}/`}>
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
        axios.delete(`${url.get()}/api/notes/${note.id}/`, {
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
        <div className="d-inline-block">
            <Button type="submit" className="btn btn-primary" onClick={handleShow}>
                Delete
            </Button>
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
            <Button type="submit" className="btn btn-primary" href={appPath.createNote}>
                Create note
            </Button>
            <br/>
        </div>
    );
}

/**
 * Categories
 * @returns {JSX.Element}
 * @constructor
 * TODO: complete the categories.
 */
const Categories = () => {
    return (
        <div className="col-lg-4">
            <div className="widget-blocks">
                <div className="col-lg-12 col-md-6">
                    <div className="widget">
                        <h2 className="section-title mb-3">Categories</h2>
                        <div className="widget-body">
                            <ul className="widget-list">
                                <li><a href="#!">animals<span className="ml-auto">(3)</span></a>
                                </li>
                                <li><a href="#!">flower<span className="ml-auto">(2)</span></a>
                                </li>
                                <li><a href="#!">portrait<span className="ml-auto">(1)</span></a>
                                </li>
                                <li><a href="#!">life<span className="ml-auto">(10)</span></a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const minId = ({notes}) => {

    const ids = notes.map((note) => note.id);

    return Math.min(...ids);
}


const Blog = ({notes}) => {

    const startId = minId({notes});

    const isAuthenticated = auth.isAuthenticated();
    return (
        <div>
            {/*{isAuthenticated ? <CreateButton/> : null}*/}
            <main className="background-white">
                <section className="section">
                    <div className="container">
                        {notes.map((note) => <PhotoNotesItem key={note.id} note={note} startId={startId}/>)}
                    </div>
                </section>
            </main>
        </div>
    );
}

export default Blog
