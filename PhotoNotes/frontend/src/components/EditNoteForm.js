import React from 'react'
import {useParams, useNavigate} from "react-router-dom";
import $ from "jquery";
import axios from "axios";
import url from "./AppURL";
import auth from "./Authentication";
import '../editNote.css';
import appPath from "./AppPath";

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
            isLoadProps: false
        };
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


    static getDerivedStateFromProps = (props, state) => {

        if (props.params.id && !state.isLoadProps) {
            const notes = props.notes;
            let id = props.params.id;
            if (id) {
                if (notes) {
                    let note = notes.find((n) => n.id === parseInt(id));
                    if (note) {
                        return {
                            title: note.title,
                            comment: note.photo_comment,
                            image: note.image,
                            isLoadProps: true
                        };
                    }
                }
            }
        }
        // Return null to indicate no change to state.
        return null;
    }

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

    handleSubmit = (event) => {

        let headers = auth.getHeaders();

        let data = new FormData();
        data.append('title', this.state.title);
        data.append('photo_comment', this.state.comment);

        // data.append('image', this.state.selectedFile || this.state.image);
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
                this.props.navigate(appPath.blog);
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
                this.props.navigate(appPath.blog);
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
            <div className="container">
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
                            <div className="text-center mb30">
                                <img id="note_image" className="rounded mx-auto d-block blog-img"
                                     src={this.state.image} alt=''/>
                            </div>
                        </div>
                        <br/>
                        <div className="form-group row">
                            <label className="col-lg-3 col-form-label form-control-label">Img File</label>
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
