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
import Viewer from 'react-viewer';
import {Link} from "react-router-dom";
import {BrowserView, MobileView} from 'react-device-detect';
import ScrollToTop from "react-scroll-to-top";

const BlogContext = createContext({});

const PhotoNotesItem = ({note, index}) => {
    const [setTag, setPage, getNotes, setPageData, setUser] = useContext(BlogContext);
    const [visible, setVisible] = React.useState(false);

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
                                <a href={`/profile/view/${note.profile_id}`}>{note.username}</a>
                            </span>
                        </div>
                        <span className="d-inline-block">{Moment(note.created).format('LLL')}</span>
                    </div>
                    <h2 className="h1">{note.title}</h2>
                    <div className="card-image">
                        <BrowserView>
                            <Link rel="noreferrer" onClick={() => {
                                setVisible(true);
                            }}>
                                <img className="w-100" src={note.image} alt={note.title}></img>
                            </Link>
                            <Viewer
                                visible={visible}
                                onClose={() => {
                                    setVisible(false);
                                }}
                                showTotal={false}
                                noNavbar={true}
                                onMaskClick={() => {
                                    setVisible(false);
                                }}
                                images={[{src: note.image, alt: `${note.title} `}]}
                            />
                        </BrowserView>
                        <MobileView>
                            <a href={note.image}>
                                <img src={note.image} className="w-100" alt=""/>
                            </a>
                        </MobileView>
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
                        {showControlButtons() ? <DeleteButton note={note} setPageData={setPageData}/> : null}
                        {showControlButtons() ? <EditButton noteId={note.id}/> : null}
                    </div>
                </article>
            </div>
        </div>
    );
}

/**
 * Tags
 * @returns {JSX.Element}
 * @constructor
 */
const Tags = ({groupTags, selectedTag}) => {
    const [setTag, setPage, getNotes, setPageData, setUser] = useContext(BlogContext);

    return (
        <div className="widget-blocks">
            <div className="widget">
                <h2 className="section-title mb-3">Tags</h2>
                <div className="widget-body">
                    <ul className="widget-list">
                        <div>
                            <li>
                                <a className={selectedTag ? "" : "fw-bold"}
                                   onClick={() => {
                                       setTag('');
                                       setPage('');
                                       getNotes();
                                   }}
                                >
                                    All
                                </a>
                            </li>
                        </div>
                        {groupTags.map((t, i) => {
                            return (
                                <li key={i}>
                                    <a className={selectedTag === t.value ? "fw-bold" : ""}
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
    );
}

/**
 * UsersNotes
 * @returns {JSX.Element}
 * @constructor
 */
const UsersNotes = ({groupUsersNotes, selectedUser}) => {
    const [setTag, setPage, getNotes, setPageData, setUser] = useContext(BlogContext);

    return (
        <div className="widget-blocks">
            <div className="widget">
                <h2 className="section-title mb-3">Users</h2>
                <div className="widget-body">
                    <ul className="widget-list">
                        <div>
                            <li>
                                <a className={selectedUser ? "" : "fw-bold"}
                                   onClick={() => {
                                       setUser('');
                                       setPage('');
                                       getNotes();
                                   }}
                                >
                                    All
                                </a>
                            </li>
                        </div>
                        {groupUsersNotes.map((t, i) => {
                            return (
                                <li key={i}>
                                    <a className={selectedUser === t.user__username ? "fw-bold" : ""}
                                       onClick={() => {
                                           setUser(t.user__username);
                                           setPage('');
                                           getNotes();
                                       }}
                                    >
                                        {t.user__username} {t.total}
                                    </a>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </div>
    );
}

function BlogPagination({paginator}) {
    const [setTag, setPage, getNotes, setPageData, setUser] = useContext(BlogContext);

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
            users: [],
            paginator: {},
            selectedTag: '',
            selectedUser: '',
            selectedPage: ''
        }
    }

    componentDidMount() {
        this.state.selectedTag = this.props.selectedTag;
        this.state.selectedPage = this.props.selectedPage;
        this.state.selectedUser = this.props.selectedUser;

        this.getNotes();
    }

    backToTop() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }

    getNotes() {
        this.props.pageData(this.state.selectedTag, this.state.selectedPage);

        let blogUrl = `${url.get()}/api/notes/`;

        if (this.state.selectedPage && this.state.selectedTag) {
            blogUrl += '?p=' + this.state.selectedPage + '&tags=' + this.state.selectedTag;
        } else if (this.state.selectedPage && this.state.selectedUser) {
            blogUrl += '?p=' + this.state.selectedPage + '&user=' + this.state.selectedUser;
        } else if (this.state.selectedPage) {
            blogUrl += '?p=' + this.state.selectedPage;
        } else if (this.state.selectedTag) {
            blogUrl += '?tags=' + this.state.selectedTag;
        } else if (this.state.selectedUser) {
            blogUrl += '?user=' + this.state.selectedUser;
        }

        let headers = Auth.getHeaders();

        axios.get(blogUrl, {
            headers: headers,
        }).then(response => {
            const notes = response.data
            this.setState(
                {
                    notes: notes.results,
                    tags: notes.tags,
                    users: notes.user_notes,
                    paginator: notes.paginator
                }
            )
            this.backToTop();
        }).catch(error => console.log(error))
    }

    setPageData(tag, page, user) {
        this.props.pageData(tag, page, user);
    }

    setTag(tag) {
        this.state.selectedTag = tag;
        this.state.selectedUser = "";
    }

    setUser(user) {
        this.state.selectedUser = user;
        this.state.selectedTag = "";
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
                                value={[this.setTag.bind(this), this.setPage.bind(this),
                                    this.getNotes.bind(this), this.setPageData.bind(this),
                                    this.setUser.bind(this)]}>
                                <div className="row no-gutters-lg">
                                    <div className="d-flex ">
                                        <div className="d-inline-block col-9 mb-lg-5">
                                            {this.state.notes.map((note, index) =>
                                                <PhotoNotesItem key={note.id} note={note} index={index}/>)}
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
                                        <div className="d-inline-block col-3">
                                            <div>
                                                {this.state.tags.length > 0 ?
                                                    <Tags groupTags={this.state.tags}
                                                          selectedTag={this.state.selectedTag}/> : null}
                                            </div>
                                            <div>
                                                {this.state.users.length > 0 ?
                                                    <UsersNotes groupUsersNotes={this.state.users}
                                                                selectedUser={this.state.selectedUser}/> : null}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </BlogContext.Provider>
                        </div>
                    </section>
                </main>
                <ScrollToTop smooth color='#336666' className='scroll-to-top-up-100 '/>
            </div>
        )
    }
}


export default withParams(BlogPage);
