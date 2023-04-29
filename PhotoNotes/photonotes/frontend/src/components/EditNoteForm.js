import React from "react";
import $ from "jquery";
import axios from "axios";
import url from "./AppURL";
import Auth from "./Authentication";
import {TagsInput} from "react-tag-input-component";
import withParams from "./ComponentWithParams";
import appPath from "./AppPath";
import Spinner from "react-bootstrap/Spinner";


class EditNoteForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            comment: '',
            image: null,
            selectedFile: null,
            is_pinned: '',
            is_private: '',
            is_hide_minicard: '',
            tags: [],
            tagsWasChanged: false
        };
    }

    componentDidMount() {

        let noteId = this.props.params.id;

        if (noteId) {
            let headers = Auth.getHeaders();
            let notesUrl = `${url.get()}/api/notes/?note_id=${noteId}`;
            axios.get(`${notesUrl}`, {
                headers: headers,
            }).then(response => {
                const note = response.data.results[0];
                this.setState(
                    {
                        title: note.title,
                        comment: note.photo_comment,
                        image: note.image,
                        tags: note.tags,
                        is_pinned: note.is_pinned,
                        is_private: note.is_private,
                        is_hide_minicard: note.is_hide_minicard
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

    handleChangePrivate = (event) => {
        let value = event.target.checked;

        this.setState(
            {
                [event.target.name]: value,
            }
        );

        if (value) {
            this.setState(
                {
                    is_hide_minicard: true,
                }
            );
            $('#is_hide_minicard').attr("disabled", true);
        } else {
            this.setState(
                {
                    is_hide_minicard: false,
                }
            );
            $('#is_hide_minicard').removeAttr("disabled");
        }
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

    handleTagsChange = (event) => {
        this.setState(
            {
                tags: event
            }
        );
    }

    handleSubmit = (event) => {

        $('#save-button').prop('disabled', true);
        $('#spinner-loading').removeClass('visually-hidden');

        if ($('#note_image').attr('src')) {
            $('#chooseFile').prop('required', false);
        } else {
            $('#chooseFile').prop('required', true);
        }

        let form = document.querySelectorAll('.requires-validation')[0];

        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }

        let headers = Auth.getHeaders();

        let data = new FormData();
        data.append('title', this.state.title);
        data.append('photo_comment', this.state.comment);
        data.append('tags', JSON.stringify(this.state.tags));

        if (this.state.selectedFile) {
            data.append('image', this.state.selectedFile);
        }

        data.append('is_pinned', this.state.is_pinned);
        data.append('is_private', this.state.is_private);
        data.append('is_hide_minicard', this.state.is_hide_minicard);

        if (this.props.params.id) {
            // Edit note.
            data.append('id', this.props.params.id);
            axios.put(`${url.get()}/api/notes/${this.props.params.id}/`,
                data,
                {
                    headers: headers,
                }).then(response => {
                if (this.state.tagsIsChange) {
                    this.props.pageData('', '');
                }
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
                this.props.pageData('', '');
                this.props.navigate(appPath.blog);
            }).catch(error => {
                $('#spinner-loading').addClass('visually-hidden');
                this.noteError(error)
            });
        }
    }

    backSubmit = (event) => {
        this.props.navigate(-1);
    }

    noteError = (error) => {
        console.log(error);
        alert('Error change or create note!');
    }

    tagEdit = (event) => {
        this.setState(
            {
                tagsWasChanged: true
            }
        );
    }

    render() {
        return (
            <div>
                <main>
                    <section className="section">
                        <div className="container">
                            <div className="col-lg-12 d-flex justify-content-center">
                                <div className="col-lg-8 pb-4">
                                    <form className="requires-validation" noValidate>
                                        <h2 className="text-center">{this.props.pagetitle}</h2>
                                        <div className="form-group row">
                                            <label className="col-lg-3 col-form-label form-control-label">Title</label>
                                            <div className="col-lg-9">
                                                <input className="form-control placeholder-custom-color" id="title"
                                                       name="title"
                                                       type="text"
                                                       placeholder="Enter title.."
                                                       value={this.state.title}
                                                       onChange={(event) => this.handleChange(event)}
                                                       required/>
                                                <div className="valid-feedback">Title field is valid!</div>
                                                <div className="invalid-feedback">Title field cannot be blank!</div>
                                            </div>
                                        </div>
                                        <br/>
                                        <div className="form-group row">
                                            {this.state.image || this.state.selectedFile ? (
                                                <label
                                                    className="col-lg-3 col-form-label form-control-label">Image</label>
                                            ) : null}
                                            <div className="col-lg-9">
                                                <div className="text-center mb30">
                                                    <img id="note_image" className="rounded mx-auto d-block blog-img"
                                                         src={this.state.image} alt=''/>
                                                </div>
                                            </div>
                                        </div>
                                        <br/>

                                        <div className="form-group row">
                                            <label className="col-lg-3 col-form-label form-control-label">Image
                                                File</label>
                                            <div className="col-lg-9">
                                                <input id="chooseFile" className="form-control placeholder-custom-color"
                                                       type="file"
                                                       name="chooseFile"
                                                       onChange={(event) => this.onFileChange(event)}/>
                                                <div className="valid-feedback">File field is valid!</div>
                                                <div className="invalid-feedback">File field cannot be blank!</div>
                                            </div>
                                        </div>

                                        <br/>
                                        <div className="form-group row">
                                            <label
                                                className="col-lg-3 col-form-label form-control-label">Comment</label>
                                            <div className="col-lg-9">
                                                <textarea className="form-control" id="comment" name="comment"
                                                          rows="7"
                                                          placeholder="Comment, please.."
                                                          value={this.state.comment}
                                                          onChange={(event) => this.handleChange(event)}
                                                          required/>
                                                <div className="valid-feedback">Comment field is valid!</div>
                                                <div className="invalid-feedback">Comment field cannot be blank!</div>
                                            </div>
                                        </div>
                                        <br/>
                                        <div className="form-group row">
                                            <label className="col-lg-3 col-form-label form-control-label">Pinned</label>
                                            <div className="col-lg-9">
                                                <input className="form-check-input" id="is_pinned" name="is_pinned"
                                                       type="checkbox"
                                                       checked={this.state.is_pinned}
                                                       onChange={(event) => this.handleChange(event)}
                                                />
                                            </div>
                                            <label
                                                className="col-lg-3 col-form-label form-control-label">Private</label>
                                            <div className="col-lg-9">
                                                <input className="form-check-input" id="is_private" name="is_private"
                                                       type="checkbox"
                                                       checked={this.state.is_private}
                                                       onChange={(event) => this.handleChangePrivate(event)}
                                                />
                                            </div>
                                            <label id="is_hide_minicard_label"
                                                   name="is_hide_minicard_label"
                                                   className={this.state.is_private ? "col-lg-3 col-form-label form-control-label text-muted" :
                                                       "col-lg-3 col-form-label form-control-label"}>Hide mini
                                                card</label>
                                            <div className="col-lg-9">
                                                <input className="form-check-input" id="is_hide_minicard"
                                                       name="is_hide_minicard"
                                                       type="checkbox"
                                                       checked={this.state.is_hide_minicard}
                                                       onChange={(event) => this.handleChange(event)}
                                                       disabled={this.state.is_private}
                                                />
                                            </div>
                                        </div>
                                        <br/>
                                        <div className="form-group row">
                                            <label className="col-lg-3 col-form-label form-control-label">Tags</label>
                                            <div className="col-lg-9">
                                                <TagsInput
                                                    id="tagsInput"
                                                    className="form-control"
                                                    value={this.state.tags}
                                                    onChange={(event) => this.handleTagsChange(event)}
                                                    onKeyUp={(event) => this.tagEdit(event)}
                                                    onRemoved={(event) => this.tagEdit(event)}
                                                    name="tags"
                                                    placeHolder="Enter tags.."
                                                />
                                            </div>
                                        </div>
                                        <br/>
                                        <div className="text-center">
                                            <Spinner id="spinner-loading" className="visually-hidden" animation="border"
                                                     variant="success"/>
                                        </div>
                                        <br/>
                                        <div className="form-group row">
                                            <label className="col-lg-3 col-form-label form-control-label"></label>
                                            <div className="col-lg-9">
                                                <input type="reset" className="btn btn-secondary" value="Cancel"
                                                       onClick={(event) => this.backSubmit(event)}/>
                                                <input id="save-button" type="button" className="btn btn-primary ms-2"
                                                       value="Save Changes"
                                                       onClick={(event) => this.handleSubmit(event)}/>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        )
    }
}

export default withParams(EditNoteForm)
