import '../comments.css';
import React, {createContext, useContext, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import url from "./AppURL";
import axios from "axios";
import Moment from "moment";
import TextArea from "react-textarea-autosize";
import Markdown from 'markdown-to-jsx';
import Auth from './Authentication'
import styled from "styled-components";
import $ from "jquery";

const ReplyingContext = createContext({});
const CommentContext = createContext([]);
const ThemeContext = createContext([]);
const Authentication = Auth;

const withParams = (Component) => {
    return props => <Component {...props} params={useParams()}/>;
}

const compare = (a1, a2) => {
    return JSON.stringify(a1) === JSON.stringify(a2);
}

const getCurrentUserName = () => {
    Authentication.getTokenFromStorage();
    return Authentication.username;
}

const Reply = (props) => {
    const [addComment, deleteComment] = useContext(CommentContext);
    const [text, setText] = useState("");
    const [username, setUsername] = useState("");
    const routeParams = useParams();

    const handleSubmit = (event, props) => {
        let form = $(`#form_${props.parent_id ? props.parent_id : 0}`)[0];
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }

        let data = {
            body: text,
            note: parseInt(routeParams.id),
            user: username ? username : getCurrentUserName(),
            parent: props.parent_id === undefined ? null : props.parent_id,
            children: []
        };

        addComment(data);

        $('textarea[name="comment"]').val('');
        if (props.parent_id) {
            $(".selected").removeClass('selected');
            form.children[0].classList.add('hidden');
        }
    }

    return (
        <div className="comment-reply">
            <form id={`form_${props.parent_id ? props.parent_id : 0}`} noValidate
                  className="requires-validation">
                <div {...props}>
                    <div>
                        <TextArea className="form-control mb-1 text-area-reply"
                                  id={`username_${props.parent_id ? props.parent_id : 0}`}
                                  name="username"
                                  rows="1"
                                  placeholder="Username.."
                                  defaultValue={getCurrentUserName()}
                                  readOnly={getCurrentUserName() ? true : false}
                                  onChange={value => {
                                      setUsername(value.target.value);
                                  }}
                                  required
                        />
                    </div>

                    <div>
                        <TextArea name="comment"
                                  className="form-control mb-1 text-area-reply"
                                  placeholder="What are your thoughts?"
                                  minRows={2}
                                  defaultValue={text}
                                  onChange={value => {
                                      setText(value.target.value);
                                  }}
                                  required
                        />
                    </div>

                    <div className="panel">
                        <div className="comment_as">
                            {$(`#username_${props.parent_id ? props.parent_id : 0}`).val() ? 'Comment as ' : ''}
                            <div className="username">
                                {$(`#username_${props.parent_id ? props.parent_id : 0}`).val()}
                            </div>
                        </div>
                        <input type="button" className="btn btn-primary ms-2 border-0" value="Comment"
                               onClick={(event) =>
                                   handleSubmit(event, props)
                               }/>
                    </div>
                </div>
                <div id="add-comment-message"></div>
            </form>
        </div>

    );
}

const gen_comments = (comments, colorindex, path) => {
    return comments.map((comment, i) => {
        return (
            <Comment
                id={comment.id}
                parent={comment.parent}
                username={comment.user}
                note_owner={comment.note_owner}
                date={comment.created}
                text={comment.body}
                comments={comment.children}
                colorindex={colorindex}
                key={i}
                path={[...path, i]}
            />
        );
    });
}

let Comment = (props) => {
    const [replying, setReplying] = useContext(ReplyingContext);
    const [addComment, deleteComment] = useContext(CommentContext);
    const [minimized, setMinimized] = useState(false);
    const [hidden, setHidden] = useState(false);
    const [hiddenCommentId, setHiddenCommentId] = useState(-1);

    useEffect(() => {
        const calcHidden = async () => {
            if (((props.path.length > 4 && props.path.length % 2 === 0) ||
                (props.path[props.path.length - 1] > 5)) && (hiddenCommentId !== props.id)) {
                setHidden(true);
            }
        };

        calcHidden().then(r => {
        });
    }, [props]);

    const showDeleteButton = () => {
        if (getCurrentUserName() === props.note_owner) {
            return true;
        }
        return false;
    }

    return (
        <div {...props}>
            <div className="record-comment">
                {hidden ? (
                    <button
                        id="showMore"
                        onClick={() => {
                            setHidden(false);
                            setHiddenCommentId(props.id);
                        }}
                    >
                        Show More Replies
                    </button>
                ) : (
                    <>
                        <div id="right">
                            <div id="top">
              <span
                  className="minimize"
                  onClick={() => {
                      setMinimized(!minimized);
                  }}
              >
                [{minimized ? "+" : "-"}]
              </span>
                                <span id="username">{props.username}</span>
                                <span id="date">{Moment(props.date).format('LLL')}</span>
                            </div>
                            <div id="content" className={minimized ? "hidden" : ""}>
                                <Markdown className="comment-body" options={{forceBlock: true}}>{props.text}</Markdown>
                            </div>
                            <div id="actions" className={minimized ? "hidden" : ""}>
                                <div className="d-flex justify-content-between">
              <span
                  className={`${compare(replying, props.path) ? "selected" : ""}`}
                  onClick={() => {
                      if (compare(replying, props.path)) {
                          setReplying([]);
                      } else {
                          setReplying(props.path);
                      }
                  }}
              >
                      <div className="reply-link d-inline-block">reply</div>
              </span>
              {showDeleteButton() ? (
              <span
                    className={`${compare(replying, props.path) ? "selected" : ""}`}
                    onClick={() => {
                        deleteComment(props.id);
                    }}
              >
                    <div className="reply-link d-inline-block">delete</div>
              </span>) : null}

                                </div>
                            </div>
                            <Reply
                                className={
                                    compare(replying, props.path) && !minimized ? "" : "hidden"
                                }
                                parent_id={props.id}
                            />
                            <div className={`comments ${minimized ? "hidden" : ""}`}>
                                {gen_comments(props.comments, props.colorindex + 1, [
                                    ...props.path
                                ])}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>

    );
}

Comment = styled(Comment)`
  background: ${props => (props.colorindex % 2 === 0 ? "#FFFFFF" : "#f5f5f5")};
`;

const Card = (props) => {
    const theme = useContext(ThemeContext);
    return (
        <div {...props} className={`${props.className} ${theme}`}>
            {props.children}
        </div>
    );
}

class Comments extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            comments: [],
            count: '',
            replying: '',
        }
    }

    getComments() {
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

    componentDidMount() {
        this.getComments();
    }

    setReplying(replying) {
        this.setState(
            {
                replying: replying
            }
        )
    }

    addComment(data) {

        let id = this.props.params.id;

        if (!id) {
            return;
        }

        let headers = Authentication.getHeaders();

        let commentsUrl = `${url.get()}/api/comments/?note_id=${id}/`;
        axios.post(commentsUrl,
            data,
            {
                headers: headers,
            }).then(response => {

                if (response.data.is_forbidden) {
                    $('#add-comment-message').html(`${response.data.message}`).css('color', '#ff606e');
                    return;
                }

                this.getComments();
        }).catch(error => {
            console.log(error);
            alert('Added comment error!');
        });
    }

    deleteComment(comment_id) {

        let headers = Authentication.getHeaders();

        let commentDeleteUrl = `${url.get()}/api/comments/${comment_id}/`

        axios.delete(commentDeleteUrl, {
            headers: headers,
        }).then(() => {
            this.getComments();
        }).catch(error => {
            console.log(error);
            alert('Delete comment error!');
        });
    }

    render() {

        return (
            <div>
                <Card className="comment-card" {...this.props}>
                    <span id="comments">Comments </span>
                    <span id="comments_count">{this.state.count}</span>
                    <CommentContext.Provider value={[this.addComment.bind(this), this.deleteComment.bind(this)]}>
                        <ReplyingContext.Provider value={[this.state.replying, this.setReplying.bind(this)]}>
                            <Reply/>
                            {gen_comments(this.state.comments, 0, [])}
                        </ReplyingContext.Provider>
                    </CommentContext.Provider>
                </Card>
            </div>
        )
    }
}

export default withParams(Comments)
