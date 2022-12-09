import '../editNote.css';
import React from "react";
import {useParams, useNavigate} from "react-router-dom";
import $ from "jquery";
import axios from "axios";
import url from "./AppURL";
import Auth from "./Authentication";
import appPath from "./AppPath";
import {TagsInput} from "react-tag-input-component";
import Constants from "./AppConstants";

const withParams = (Component) => {
    return props => <Component {...props} params={useParams()} navigate={useNavigate()}/>;
}

class EditNoteForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            comment: '',
            image: null,
            selectedFile: null,
            tags: []
        };
    }

    componentDidMount() {

        let noteId = this.props.params.id;

        if (noteId) {
            Auth.getTokenFromStorage();
            let notesUrl = `${url.get()}/api/notes/?note_id=${noteId}`;
            axios.get(`${notesUrl}`)
                .then(response => {
                    const note = response.data.results[0];
                    this.setState(
                        {
                            title: note.title,
                            comment: note.photo_comment,
                            image: note.image,
                            tags: note.tags
                        }
                    )
                }).catch(error => console.log(error))
        }
    }

    onFileChange = (event) => {

        this.setState({selectedFile: event.target.files[0]});

        if (event.target.files[0]) {
            $(".file-upload").addClass('active');
            $("#noFile").text(event.target.files[0].name);
            let uploadedFile = URL.createObjectURL(event.target.files[0]);
            $("#note_image").attr("src", uploadedFile);
        } else {
            $(".file-upload").removeClass('active');
            $("#noFile").text("No file chosen...");
        }
    };

    handleChange = (event) => {
        let value = event.target.value;
        if (event.target.type === "checkbox") {
            value = event.target.checked;
        }
        this.setState(
            {
                [event.target.name]: value
            }
        );
    }

    handleTagsChange = (event) => {
        this.setState(
            {
                tags: event
            }
        );
    }

    handleSubmit = (event) => {

        let headers = Auth.getHeaders();

        let data = new FormData();
        data.append('title', this.state.title);
        data.append('photo_comment', this.state.comment);
        data.append('tags', JSON.stringify(this.state.tags));

        if (this.state.selectedFile) {
            data.append('image', this.state.selectedFile);
        }

        if (this.props.params.id) {
            // Edit note.
            data.append('id', this.props.params.id);
            axios.put(`${url.get()}/api/notes/${this.props.params.id}/`,
                data,
                {
                    headers: headers,
                }).then(response => {
                this.props.navigate(`/blog/${this.props.params.tag ? this.props.params.tag : Constants.allTags}/${Constants.firstPage}`);
            }).catch(error => {
                this.noteError(error)
            });
        } else {
            // Create note.
            axios.post(`${url.get()}/api/notes/`,
                data,
                {
                    headers: headers,
                }).then(response => {
                this.props.navigate(`/blog/${this.props.params.tag ? this.props.params.tag : Constants.allTags}/${Constants.firstPage}`);
            }).catch(error => {
                this.noteError(error)
            });
        }
    }

    backSubmit = (event) => {
        this.props.navigate(appPath.blog);
    }

    noteError = (error) => {
        console.log(error);
        alert('Error change or create note!');
    }

    render() {
        return (
            <div className="container mt-4 mb-4">
                <div className="col-lg-12 text-lg-center">
                    <h2>Edit Note</h2>
                    <br/><br/>
                </div>
                <div className="col-lg-8 push-lg-4 personal-info">
                    <form role="form">

                        <div className="form-group row">
                            <label className="col-lg-3 col-form-label form-control-label">Title</label>
                            <div className="col-lg-9">
                                <input className="form-control" id="title" name="title" type="text"
                                       placeholder="Enter title"
                                       value={this.state.title}
                                       onChange={(event) => this.handleChange(event)}/>
                            </div>
                        </div>
                        <br/>
                        <div className="form-group row">
                            <label className="col-lg-3 col-form-label form-control-label">Image</label>
                            <div className="col-lg-9">
                                <div className="text-center mb30">
                                    <img id="note_image" className="rounded mx-auto d-block blog-img"
                                         src={this.state.image} alt=''/>
                                </div>
                            </div>
                        </div>
                        <br/>
                        <div className="form-group row">
                            <label className="col-lg-3 col-form-label form-control-label">Image File</label>
                            <div className="col-lg-9">
                                <div className="file-upload">
                                    <div className="file-select">
                                        <div className="file-select-button" id="fileName">Choose File</div>
                                        <div className="file-select-name" id="noFile">No file chosen...</div>
                                        <input type="file" name="chooseFile" id="chooseFile"
                                               onChange={(event) => this.onFileChange(event)}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <br/>
                        <div className="form-group row">
                            <label className="col-lg-3 col-form-label form-control-label">Comment</label>
                            <div className="col-lg-9">
                                <textarea className="form-control" id="comment" name="comment"
                                          rows="4" placeholder="Comment, please.."
                                          value={this.state.comment}
                                          onChange={(event) => this.handleChange(event)}/>
                            </div>
                        </div>
                        <br/>
                        <div className="form-group row">
                            <label className="col-lg-3 col-form-label form-control-label">Tags</label>
                            <div className="col-lg-9">
                                <TagsInput
                                    value={this.state.tags}
                                    onChange={(event) => this.handleTagsChange(event)}
                                    name="tags"
                                    placeHolder="enter tags"
                                />
                            </div>
                        </div>
                        <br/>
                        <div className="form-group row">
                            <label className="col-lg-3 col-form-label form-control-label"></label>
                            <div className="col-lg-9">
                                <input type="reset" className="btn btn-secondary" value="Cancel"
                                       onClick={(event) => this.backSubmit(event)}/>
                                <input type="button" className="btn btn-primary ms-2" value="Save Changes"
                                       onClick={(event) => this.handleSubmit(event)}/>
                            </div>
                        </div>

                    </form>
                </div>
            </div>
        )
    }
}

export default withParams(EditNoteForm)
