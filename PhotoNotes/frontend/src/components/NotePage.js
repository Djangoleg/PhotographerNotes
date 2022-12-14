import React, {createContext, useContext} from "react";
import url from "./AppURL";
import axios from "axios";
import Moment from "moment/moment";
import Comments from "./Comments";
import BackButton from "./BackButton";
import Auth from "./Authentication";
import DeleteButton from "./DeleteButton";
import EditButton from "./EditButton";
import withParams from "./ComponentWithParams";
import appPath from "./AppPath";
import {useNavigate} from "react-router-dom";

const BlogContext = createContext({});

const Note = ({note}) => {
    const [setPageData] = useContext(BlogContext);
    const navigate = useNavigate();

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
                    <div className="post-info d-flex justify-content-between">
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
                                {note.tags ?
                                    note.tags.map((tag, i) => {
                                        return (
                                            <a key={i} onClick={() => {
                                                setPageData(tag, '');
                                                navigate(appPath.blog);
                                            }}>{tag}</a>
                                        );
                                    }) : null}
                            </li>
                        </ul>
                        <p className="card-text m-3">{note.photo_comment}</p>
                    </div>
                    <div className="d-flex justify-content-end">
                        {showControlButtons() ? <DeleteButton note={note} setPageData={setPageData}/> : null}
                        {showControlButtons() ? <EditButton noteId={note.id}/> : null}
                        <BackButton/>
                    </div>
                </article>
            </div>
        </div>
    );
}

class NotePage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            note: {}
        }
    }

    componentDidMount() {

        let noteId = this.props.params.id;

        if (!noteId) {
            return;
        }

        let noteUrl = `${url.get()}/api/notes/?note_id=${noteId}`;

        axios.get(noteUrl)
            .then(response => {
                const note = response.data
                this.setState(
                    {
                        note: note.results[0]
                    }
                )
            }).catch(error => console.log(error))
    }

    setPageData(tag, page) {
        this.props.pageData(tag, page);
    }

    render() {
        return (
            <div>
                <main>
                    <section className="section">
                        <div className="container">
                            <div className="row no-gutters-lg justify-content-center">
                                <div className="col-lg-9 mb-lg-5">
                                    <BlogContext.Provider value={[this.setPageData.bind(this)]}>
                                        <Note note={this.state.note}/>
                                        <Comments note={this.state.note.id}/>
                                    </BlogContext.Provider>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        )
    }
}


export default withParams(NotePage)