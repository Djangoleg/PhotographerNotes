import React from "react";
import {useNavigate, useParams} from "react-router-dom";
import url from "./AppURL";
import axios from "axios";
import Constants from "./AppConstants";
import Moment from "moment/moment";
import Comments from "./Comments";

const Note = ({note}) => {

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
                                { note.tags ?
                                    note.tags.map((tag) => {
                                    return (
                                        <a key={tag} href={`/blog/${tag}/${Constants.firstPage}`}>{tag} </a>
                                    );
                                }) : null}
                            </li>
                        </ul>
                        <p className="card-text m-3">{note.photo_comment}</p>
                    </div>
                </article>
            </div>
        </div>
    );
}

const withParams = (Component) => {
    return props => <Component {...props} params={useParams()} navigate={useNavigate()}/>;
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

    render() {
        return (
            <div>
                <main>
                    <section className="section">
                        <div className="container">
                            <div className="row no-gutters-lg">
                                <div className="col-lg-8 mb-lg-5">
                                    <Note note={this.state.note} />
                                    <Comments note={this.state.note.id} />
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