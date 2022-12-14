import React, {useState} from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Moment from 'moment';
import Auth from "./Authentication";
import Constants from "./AppConstants";
import axios from "axios";
import url from "./AppURL";
import '../blog.css';
import {useNavigate, useParams} from "react-router-dom";
import Pagination from 'react-bootstrap/Pagination';

const PhotoNotesItem = ({note, tag, page}) => {

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
                        <img loading="lazy" decoding="async" src={note.image} className="w-100"/>
                    </div>
                    <div className="card-body px-0 pb-1">
                        <ul className="post-meta mb-2">
                            <li>
                                {note.tags.map((tag, i) => {
                                    return (
                                        <a key={i} href={`/blog/${tag}/${Constants.firstPage}`}>{tag} </a>
                                    );
                                })}
                            </li>
                        </ul>
                        <p className="card-text m-3">{note.photo_comment}</p>
                    </div>
                    <div className="d-flex justify-content-between">
                        {isAuthenticated ? <DeleteButton note={note} /> : null}
                        {isAuthenticated ? <EditButton noteId={note.id} tag={tag} page={page} /> : null}
                        <DetailButton noteId={note.id} />
                    </div>
                </article>
            </div>
        </div>
    );
}

const EditButton = ({noteId, tag, page}) => {
    return (
        <div className="d-inline-block">
            <Button type="submit" className="btn btn-primary" href={`/note/${noteId}/${tag}/${page}`}>
                Edit
            </Button>
        </div>
    )
}


const DetailButton = ({noteId}) => {
    return (
        <div className="d-inline-block">
            <Button type="submit" className="btn btn-primary" href={`/note/view/${noteId}`}>
                Detail
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
                                <li><a href={`/blog/${Constants.allTags}/${Constants.firstPage}`}>All </a></li>
                                {groupTags.map((t, i) => {
                                    return (
                                        <li key={i}><a href={`/blog/${t.value}/${Constants.firstPage}`}>{t.value} <span
                                            className="ml-auto">({t.total})</span></a>
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

function BlogPagination({paginator, tag}) {

    let pageCount = Math.ceil(paginator.count/Constants.pageSize);

    let items = [];
    for (let number = 1; number <= pageCount; number++) {
        items.push(
            <Pagination.Item key={number} active={number === paginator.active_page} href={`/blog/${tag}/${number}`}>
                {number}
            </Pagination.Item>,
        );
    }

    let prev;
    if (paginator.active_page === 1) {
        prev = pageCount;
    } else {
        prev = paginator.active_page - 1;
    }

    let next;
    if (paginator.active_page === pageCount) {
        next = Constants.firstPage;
    } else {
        next = paginator.active_page + 1;
    }

    return (
        <Pagination>
            <Pagination.First href={`/blog/${tag}/1`}/>
            <Pagination.Prev href={`/blog/${tag}/${prev}`}/>
            {items}
            <Pagination.Next href={`/blog/${tag}/${next}`}/>
            <Pagination.Last href={`/blog/${tag}/${pageCount}`}/>
        </Pagination>
        // <Pagination>
        //     <Pagination.First/>
        //     <Pagination.Prev/>
        //     <Pagination.Item>{1}</Pagination.Item>
        //     <Pagination.Ellipsis/>
        //
        //     <Pagination.Item>{10}</Pagination.Item>
        //     <Pagination.Item>{11}</Pagination.Item>
        //     <Pagination.Item active>{12}</Pagination.Item>
        //     <Pagination.Item>{13}</Pagination.Item>
        //     <Pagination.Item disabled>{14}</Pagination.Item>
        //
        //     <Pagination.Ellipsis/>
        //     <Pagination.Item>{20}</Pagination.Item>
        //     <Pagination.Next/>
        //     <Pagination.Last/>
        // </Pagination>
    );
}

const withParams = (Component) => {
    return props => <Component {...props} params={useParams()} navigate={useNavigate()}/>;
}

class BlogPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            notes: [],
            tags: [],
            paginator: {}
        }
    }

    componentDidMount() {

        Auth.getTokenFromStorage();

        let tag = this.props.params.tag ? this.props.params.tag : Constants.allTags;
        let p = parseInt(this.props.params.p) ? this.props.params.p : Constants.firstPage;

        let blogUrl = `${url.get()}/api/notes/?tags=${tag}&p=${p}`;

        axios.get(blogUrl)
            .then(response => {
                const notes = response.data
                this.setState(
                    {
                        notes: notes.results,
                        tags: notes.tags,
                        paginator: notes.paginator
                    }
                )
            }).catch(error => console.log(error))
    }

    render() {
        return (
            <div>
                <main>
                    <section className="section">
                        <div className="container">
                            <div className="row no-gutters-lg">
                                <div className="col-lg-8 mb-lg-5">
                                    {this.state.notes.map((note) =>
                                        <PhotoNotesItem key={note.id} note={note}
                                            tag={this.props.params.tag ? this.props.params.tag : Constants.allTags}
                                            page={parseInt(this.props.params.p) ? this.props.params.p : Constants.firstPage}
                                        />)}
                                    <BlogPagination paginator={this.state.paginator}
                                                    tag={this.props.params.tag ? this.props.params.tag : Constants.allTags}
                                    />
                                </div>
                                <Tags groupTags={this.state.tags}/>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        )
    }
}


export default withParams(BlogPage);
