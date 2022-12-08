import React, {useState} from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Moment from 'moment';
import Auth from "./Authentication";
import appPath from "./AppPath";
import axios from "axios";
import url from "./AppURL";
import '../blog.css';
import {useNavigate, useParams} from "react-router-dom";

const PhotoNotesItem = ({note}) => {

    const isAuthenticated = Auth.isAuthenticated();

    return (

        <div className="row">
            <div className="col-12 mb-4">
                <article className="card article-card">
                    <h2 className="h1">{note.title}</h2>
                    <div className="card-image">
                        <div className="post-info">
                            <span className="text-uppercase">{Moment(note.modified).format('LLL')}</span>
                        </div>
                        <img loading="lazy" decoding="async" src={note.image}
                             alt="Post Image" className="w-100"/>
                    </div>
                    <div className="card-body px-0 pb-1">
                        <ul className="post-meta mb-2">
                            <li>
                                {note.tags.map((tag) => {
                                    return (
                                        <a key={tag} href={`/blog/${tag}`}>{tag} </a>
                                    );
                                })}
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
        let headers = Auth.getHeaders();
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
 */
const Tags = ({groupTags}) => {
    return (
        <div className="col-lg-4">
            <div className="widget-blocks">
                <div className="col-lg-12 col-md-6">
                    <div className="widget">
                        <h2 className="section-title mb-3">Tags</h2>
                        <div className="widget-body">
                            <ul className="widget-list">
                                <li><a href={appPath.blog}>All </a></li>
                                {groupTags.map((t) => {
                                    return (
                                        <li key={t.tag}><a href={`/blog/${t.tag}`}>{t.tag} <span
                                            className="ml-auto">({t.value})</span></a>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const withParams = (Component) => {
    return props => <Component {...props} params={useParams()} navigate={useNavigate()}/>;
}

class BlogPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            notes: []
        }
    }

    componentDidMount() {

        Auth.getTokenFromStorage();

        let blogUrl;
        if (this.props.params.tag) {
            blogUrl = `${url.get()}/api/notes/?tags=${this.props.params.tag}`;
        } else {
            blogUrl = `${url.get()}/api/notes/`;
        }

        axios.get(blogUrl)
            .then(response => {
                const notes = response.data
                this.setState(
                    {
                        notes: notes
                    }
                )
            }).catch(error => console.log(error))
    }

    getTagsSummary() {

        let allTags = Array();
        this.state.notes.map((note) => {
            allTags.push(...note.tags);
        });

        let tagsReduce = allTags.reduce((accumulator, currentValue) => {
            accumulator[currentValue] = accumulator[currentValue] ? ++accumulator[currentValue] : 1;
            return accumulator;
        }, {});

        let groupTags = Array();
        for (const [key, value] of Object.entries(tagsReduce)) {
            groupTags.push({tag: key, value: value});
        }
        return groupTags
    }

    render() {
        const groupTags = this.getTagsSummary();
        return (
            <div>
                {/*{isAuthenticated ? <CreateButton/> : null}*/}
                <main>
                    <section className="section">
                        <div className="container">
                            <div className="row no-gutters-lg">
                                <div className="col-lg-8 mb-lg-5">

                                    {this.state.notes.map((note) => <PhotoNotesItem key={note.id} note={note}/>)}
                                </div>
                                <Tags groupTags={groupTags}/>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        )
    }
}


export default withParams(BlogPage);
