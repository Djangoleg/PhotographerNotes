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

const CommentContext = createContext({});
const ThemeContext = createContext([]);
const Authentication = Auth;

const compare = (a1, a2) => {
    return JSON.stringify(a1) === JSON.stringify(a2);
}

const getCurrentUserName = () => {
    Authentication.getTokenFromStorage();
    return Authentication.username;
}

function Reply(props) {
    const [text, setText] = useState("");
    const [username, setUsername] = useState("");

    const routeParams = useParams();

    const handleSubmit = (event, props) => {
        let form = $(`#form_${props.parent_id ? props.parent_id : 0}`)[0];
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }

        let headers = Authentication.getHeaders();

        let data = {
            body: text,
            note: parseInt(routeParams.id),
            user: username ? username : getCurrentUserName(),
            parent: props.parent_id === undefined ? null : props.parent_id,
            children: []
        };
        console.log(data);

        let commentsUrl = `${url.get()}/api/comments/?note_id=${routeParams.id}/`;
        axios.post(commentsUrl,
            data,
            {
                headers: headers,
            }).then(response => {

            window.location.reload();
        }).catch(error => {
            console.log(error);
            alert('Added comment error!');
        });
    }

    return (

        <form id={`form_${props.parent_id ? props.parent_id : 0}`} noValidate className="requires-validation">
            <div {...props}>
                <div>
                    <TextArea className="form-control mb-1" id={`username_${props.parent_id ? props.parent_id : 0}`}
                              name="username"
                              rows="1"
                              placeholder="Username.."
                              defaultValue={getCurrentUserName()}
                              onChange={value => {
                                  setUsername(value.target.value);
                              }}
                              required
                    />
                </div>

                <div>
                    <TextArea name="comment"
                              className="form-control mb-1"
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
                        <div href="" className="username">
                            {$(`#username_${props.parent_id ? props.parent_id : 0}`).val()}
                        </div>
                    </div>
                    <input type="button" className="btn btn-primary ms-2 border-0" value="Comment"
                           onClick={(event) => handleSubmit(event, props)}/>
                </div>
            </div>
        </form>

    );
}

Reply = styled(Reply)`
  border-radius: 8px;
  border: solid 1px #d3dbe1;
  overflow: hidden;

  &.hidden {
    display: none;
  }

  textarea {
    font-family: inherit;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;

    resize: none;

    background: #f9f9f9;
    padding: 12px;
    color: #13181d;
    border: none;
    max-width: 100%;
    min-width: 100%;
  }

  .panel {
    display: flex;
    align-items: center;
    background: #e1e1e1;
    padding: 8px;

    .comment_as {
      font-size: 14px;
      color: #ffffff;
      margin-right: 8px;

      .username {
        display: inline-block;
        color: #4f9eed;
      }
    }
  }
`;

const gen_comments = (comments, colorindex, path) => {
    return comments.map((comment, i) => {
        return (
            <Comment
                id={comment.id}
                parent={comment.parent}
                username={comment.user}
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

function Comment(props) {
    const [replying, setReplying] = useContext(CommentContext);
    const [minimized, setMinimized] = useState(false);
    const [hidden, setHidden] = useState(false);
    const [hiddenCommentId, setHiddenCommentId] = useState(-1);

    useEffect(() => {
        const calcHidden = async () => {
            if (((props.path.length > 2 && props.path.length % 2 === 0) ||
                (props.path[props.path.length - 1] > 3)) && (hiddenCommentId !== props.id)) {
                setHidden(true);
            }
        };

        calcHidden().then(r => {
        });
    }, [props]);

    return (
        <div {...props}>
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
                reply
              </span>
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
    );
}

Comment = styled(Comment)`
  display: flex;
  text-align: left;
  background: ${props => (props.colorindex % 2 === 0 ? "#FFFFFF" : "#f5f5f5")};
  padding: 16px 16px 16px 12px;
  border: 0.1px solid #d3dbe1;
  border-radius: 8px;

  #showMore {
    background: none;
    border: none;
    color: #53626f;
    cursor: pointer;
    font-size: 13px;
    text-align: left;

    &:hover {
      text-decoration: underline;
    }
  }

  .comments {
    > * {
      margin-bottom: 16px;

      &:last-child {
        margin-bottom: 0px;
      }
    }

    &.hidden {
      display: none;
    }
  }

  #left {
    text-align: center;
    &.hidden {
      visibility: hidden;
      height: 0;
    }
  }

  #right {
    flex-grow: 1;

    #top {
      .minimize {
        cursor: pointer;
        color: #53626f;

        -webkit-touch-callout: none; /* iOS Safari */
        -webkit-user-select: none; /* Safari */
        -khtml-user-select: none; /* Konqueror HTML */
        -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
        user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome and Opera */
      }

      #username {
        color: #4f9eed;
      }

      #date {
        display: inline-block;
        color: #53626f;
      }

      > * {
        margin-right: 8px;
      }
    }

    #content {
      color: #FFFFFF;

      &.hidden {
        display: none;
      }
    }

    #actions {
      color: #5da5ee;
      margin-bottom: 12px;

      -webkit-touch-callout: none; /* iOS Safari */
      -webkit-user-select: none; /* Safari */
      -khtml-user-select: none; /* Konqueror HTML */
      -moz-user-select: none; /* Firefox */
      -ms-user-select: none; /* Internet Explorer/Edge */
      user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome and Opera */

      &.hidden {
        display: none;
      }

      > .selected {
        font-weight: bold;
      }

      > * {
        cursor: pointer;
        margin-right: 8px;
      }
    }
  }

  ${Reply} {
    margin-bottom: 12px;
  }
`;

const Card = (props) => {
    const theme = useContext(ThemeContext);
    return (
        <div {...props} className={`${props.className} ${theme}`}>
            {props.children}
        </div>
    );
}

const withParams = (Component) => {
    return props => <Component {...props} params={useParams()}/>;
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

    setReplying(replying) {
        this.setState(
            {
                replying: replying
            }
        )
    }

    render() {

        return (
            <div>
                <Card className="comment-card" {...this.props}>
                    <span id="comments">Comments </span>
                    <span id="comments_count">{this.state.count}</span>
                    <Reply/>
                    <CommentContext.Provider value={[this.state.replying, this.setReplying.bind(this)]}>
                        {gen_comments(this.state.comments, 0, [])}
                    </CommentContext.Provider>
                </Card>
            </div>
        )
    }
}

export default withParams(Comments)