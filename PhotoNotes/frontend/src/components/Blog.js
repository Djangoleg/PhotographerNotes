import React, {createContext, useContext} from 'react';
import Moment from 'moment';
import Auth from "./Authentication";
import Constants from "./AppConstants";
import axios from "axios";
import url from "./AppURL";
import '../blog.css';
import Pagination from 'react-bootstrap/Pagination';
import appPath from "./AppPath";
import DeleteButton from "./DeleteButton";
import EditButton from "./EditButton";
import withParams from "./ComponentWithParams";

const BlogContext = createContext({});

const PhotoNotesItem = ({note}) => {
    const [setTag, setPage, getNotes] = useContext(BlogContext);

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
                                        <a
                                            key={i}
                                            onClick={() => {
                                                setTag(tag);
                                                setPage('');
                                                getNotes();
                                            }}
                                        >
                                            {tag}
                                        </a>
                                    );
                                })}
                            </li>
                        </ul>
                        <p className="card-text m-3">{note.photo_comment}</p>
                        <div><a href={`/note/view/${note.id}`}>Comments {note.comments_number}</a></div>
                    </div>
                    <div className="d-flex justify-content-end">
                        {showControlButtons() ? <DeleteButton note={note}/> : null}
                        {showControlButtons() ? <EditButton noteId={note.id}/> : null}
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
    const [setTag, setPage, getNotes] = useContext(BlogContext);

    return (
        <div className="col-lg-2">
            <div className="widget-blocks">
                <div className="col-lg-12 col-md-6">
                    <div className="widget">
                        <h2 className="section-title mb-3">Tags</h2>
                        <div className="widget-body">
                            <ul className="widget-list">
                                <li>
                                    <a
                                        onClick={() => {
                                            setTag('');
                                            setPage('');
                                            getNotes();
                                        }}
                                    >
                                        All
                                    </a>
                                </li>
                                {groupTags.map((t, i) => {
                                    return (
                                        <li key={i}>
                                            <a
                                                onClick={() => {
                                                    setTag(t.value);
                                                    setPage('');
                                                    getNotes();
                                                }}
                                            >
                                                {t.value} {t.total}
                                            </a>
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

function BlogPagination({paginator}) {
    const [setTag, setPage, getNotes] = useContext(BlogContext);

    let pageCount = Math.ceil(paginator.count / Constants.pageSize);

    let items = [];
    for (let number = 1; number <= pageCount; number++) {
        items.push(
            <Pagination.Item key={number} active={number === paginator.active_page} onClick={() => {
                setPage(number);
                getNotes();
            }}>
                {number}
            </Pagination.Item>
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
            <Pagination.First onClick={() => {
                setPage('');
                getNotes();
            }}/>
            <Pagination.Prev onClick={() => {
                setPage(prev);
                getNotes();
            }}/>
            {items}
            <Pagination.Next onClick={() => {
                setPage(next);
                getNotes();
            }}/>
            <Pagination.Last onClick={() => {
                setPage(pageCount);
                getNotes();
            }}/>
        </Pagination>
    );
}

class BlogPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            notes: [],
            tags: [],
            paginator: {},
            selectedTag: '',
            selectedPage: ''
        }
    }

    componentDidMount() {

        console.log(`blog.js props: ${JSON.stringify(this.props)}`);
        // this.setState({
        //     selectedTag: this.props.selectedTag,
        //     selectedPage: this.props.selectedPage
        // });
        this.state.selectedTag = this.props.selectedTag;
        this.state.selectedPage = this.props.selectedPage;

        this.getNotes();
    }

    getNotes() {
        this.props.pageData(this.state.selectedTag, this.state.selectedPage)

        let blogUrl = `${url.get()}/api/notes/`;

        if (this.state.selectedPage && this.state.selectedTag) {
            blogUrl += '?p=' + this.state.selectedPage + '&tags=' + this.state.selectedTag;
        } else if (this.state.selectedPage) {
            blogUrl += '?p=' + this.state.selectedPage;
        } else if (this.state.selectedTag) {
            blogUrl += '?tags=' + this.state.selectedTag;
        }

        axios.get(blogUrl).then(response => {
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

    setTag(tag) {
        this.state.selectedTag = tag;
    }

    setPage(page) {
        this.state.selectedPage = page;
    }

    render() {
        const isAuthenticated = Auth.isAuthenticated();
        return (
            <div>
                <main>
                    <section className="section">
                        <div className="container">
                            <BlogContext.Provider
                                value={[this.setTag.bind(this), this.setPage.bind(this), this.getNotes.bind(this)]}>
                                <div className="row no-gutters-lg">
                                    {this.state.tags.length > 0 ? <Tags groupTags={this.state.tags}/> : null}
                                    <div className="col-lg-9 mb-lg-5">
                                        {this.state.notes.map((note) =>
                                            <PhotoNotesItem key={note.id} note={note}/>)}
                                        {this.state.notes.length > 0 ?

                                            (<BlogPagination paginator={this.state.paginator}/>) :

                                            (<div className="text-light">
                                                There are no posts.
                                                {isAuthenticated ? <> Create the <a
                                                        href={appPath.createNote}>first</a> one.</> :
                                                    <> Log in <a href={appPath.login}>here</a>.</>
                                                }
                                            </div>)
                                        }
                                    </div>
                                </div>
                            </BlogContext.Provider>
                        </div>
                    </section>
                </main>
            </div>
        )
    }
}


export default withParams(BlogPage);
