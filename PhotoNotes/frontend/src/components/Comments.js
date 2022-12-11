import '../note.css';
import React from "react";
import {useNavigate, useParams} from "react-router-dom";
import url from "./AppURL";
import axios from "axios";
import Moment from "moment";

const CommentItem = ({comment}) => {
    return (
        <div className="card article-card mb-3">
            <div className="comment-area-box media d-flex mb-4">
                <img alt="" src="/img/cat_100.png" className="img-fluid float-left m-lg-3 mt-2 d-inline-block"/>

                <div className="media-body ml-4 d-inline-block">
                    <h4 className="mb-0">{comment.user} </h4>
                    <span
                        className="date-icon font-secondary text-capitalize">{Moment(comment.created).format('LLL')}</span>

                    <div className="comment-content mt-3">
                        <p>{comment.body}</p>
                    </div>
                    <div className="comment-meta mt-4 mt-lg-0 mt-md-0">
                        <a href="#" className="text-underline ">Reply</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

const withParams = (Component) => {
    return props => <Component {...props} params={useParams()} navigate={useNavigate()}/>;
}

class Comments extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            comments: [],
            count: ''
        }
    }

    componentDidMount() {

        let id = this.props.params.id;

        if (!id) {
            return;
        }

        let commentsUrl = `${url.get()}/api/comments/?note_id=${id}`;

        axios.get(commentsUrl)
            .then(response => {
                const comments = response.data
                this.setState(
                    {
                        comments: comments.results,
                        count: comments.count
                    }
                )
            }).catch(error => console.log(error))
    }

    render() {
        return (
            <div className="row">
                <div className="comment-area">
                    <h3 className="mb-4 text-center">{this.state.count} Comments</h3>

                    {this.state.comments.map((comment) =>
                        <CommentItem key={comment.id} comment={comment}/>)}

                </div>
                <form className="comment-form mb-5 p-4 bg-light" id="comment-form">
                    <h3 className="mb-4 text-center">Leave a comment</h3>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <input className="form-control" type="text" name="name" id="name" placeholder="Name:"/>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <input className="form-control" type="text" name="mail" id="mail" placeholder="Email:"/>
                            </div>
                        </div>
                        <div className="col-lg-12">
                            <textarea className="form-control mb-3" name="comment" id="comment" cols="30" rows="5"
                                      placeholder="Comment"></textarea>
                        </div>
                    </div>

                    <input className="btn btn-primary mt-3" type="submit" name="submit-contact" id="submit_contact"
                           value="Submit Message"/>
                </form>
            </div>
        )
    }
}

export default withParams(Comments)