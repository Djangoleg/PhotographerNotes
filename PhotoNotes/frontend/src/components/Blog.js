import React from 'react';
import Moment from 'moment';
import Auth from "./Authentication";
import Constants from "./AppConstants";
import axios from "axios";
import url from "./AppURL";
import '../blog.css';
import {useNavigate, useParams} from "react-router-dom";
import Pagination from 'react-bootstrap/Pagination';
import appPath from "./AppPath";
import DeleteButton from "./DeleteButton";
import EditButton from "./EditButton";

const PhotoNotesItem = ({note, tag, page}) => {

    const showControlButtons = () => {
        const auth = Auth;
        if (auth.username === note.username) {
            return true;
        }
        return false;
    }

    return (

        <div className="row">
            <div className="col-12 mb-4">
                <article className="card article-card">
                    <div className="d-flex justify-content-between">
                        <div className="d-inline-block">
                            <img src="/img/Rock16.svg" title="Rock!" alt=""/>
                            <span className="text-uppercase ms-1 text-info">

                                <a href={`/profile/view/${note.profile_id}`}>{note.user_firstname}</a>

                            </span>
                        </div>
                        <span className="d-inline-block">{Moment(note.modified).format('LLL')}</span>
                    </div>
                    <h2 className="h1">{note.title}</h2>
                    <div className="card-image">
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
                        <div><a href={`/note/view/${note.id}`}>Comments {note.comments_number}</a></div>
                    </div>
                    <div className="d-flex justify-content-end">
                        {showControlButtons() ? <DeleteButton note={note}/> : null}
                        {showControlButtons() ? <EditButton noteId={note.id} tag={tag} page={page}/> : null}
                    </div>
                </article>
            </div>
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
        <div className="col-lg-2">
            <div className="widget-blocks">
                <div className="col-lg-12 col-md-6">
                    <div className="widget">
                        <h2 className="section-title mb-3">Tags</h2>
                        <div className="widget-body">
                            <ul className="widget-list">
                                <li><a href={`/blog/${Constants.allTags}/${Constants.firstPage}`}>All </a></li>
                                {groupTags.map((t, i) => {
                                    return (
                                        <li key={i}><a href={`/blog/${t.value}/${Constants.firstPage}`}>
                                            {t.value} {t.total}</a>
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

    let pageCount = Math.ceil(paginator.count / Constants.pageSize);

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

        const isAuthenticated = Auth.isAuthenticated();

        return (
            <div>
                <main>
                    <section className="section">
                        <div className="container">
                            <div className="row no-gutters-lg">
                                {this.state.tags.length > 0 ? <Tags groupTags={this.state.tags}/> : null}
                                <div className="col-lg-9 mb-lg-5">
                                    {this.state.notes.map((note) =>
                                        <PhotoNotesItem key={note.id} note={note}
                                                        tag={this.props.params.tag ? this.props.params.tag : Constants.allTags}
                                                        page={parseInt(this.props.params.p) ? this.props.params.p : Constants.firstPage}
                                        />)}
                                    {this.state.notes.length > 0 ?
                                        <BlogPagination paginator={this.state.paginator}
                                                        tag={this.props.params.tag ? this.props.params.tag : Constants.allTags}
                                        /> :
                                        <div className="text-light">
                                            There are no posts.
                                            {isAuthenticated ? <> Create the <a
                                                    href={appPath.createNote}>first</a> one.</> :
                                                <> Log in <a href={appPath.login}>here</a>.</>
                                            }
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        )
    }
}


export default withParams(BlogPage);
