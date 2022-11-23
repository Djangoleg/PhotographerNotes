import React from 'react'
import {useParams} from "react-router-dom";
import $ from "jquery";
import axios from "axios";
import url from "./AppURL";
import auth from "./Authentication";
import '../editNote.css';

const withParams = (Component) => {
    return props => <Component {...props} params={useParams()}/>;
}

class NoteForm extends React.Component {
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
        this.setState(
            {
                [event.target.name]: event.target.value
            }
        );
    }

    handleSubmit = (event) => {

        let headers = auth.getHeaders();

        let data = new FormData();
        data.append('title', this.state.title);
        data.append('photo_comment', this.state.comment);
        data.append('use_on_index', false);
        data.append('image', this.state.selectedFile || this.state.image);

        if (this.props.params.id) {
            // Edit note.
            data.append('id', this.props.params.id);
            axios.put(`${url.get()}/api/notes/${this.props.params.id}/`,
                data,
                {
                    headers: headers,
                }).then(response => {
                console.log(response)
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
                console.log(response)
            }).catch(error => {
                this.noteError(error)
            });
        }
    }

    noteError = (error) => {
        console.log(error);
        alert('Error change or create note!');
    }

    render() {
        return (
            <div className="row">
                <div className="col-md-12">
                    {/*<div id="noteId" className="d-none">{id}</div>*/}
                    <label>
                        Title:
                        <input id="title" name="title" type="text" value={this.state.title}
                               onChange={(event) => this.handleChange(event)}/>
                    </label>
                    <br/>
                    <div className="profile-photo text-center mb30">
                        <img className="rounded mx-auto d-block blog-img"
                             src={this.state.image} alt=''/>
                    </div>

                    <div className="file-upload">
                        <div className="file-select">
                            <div className="file-select-button" id="fileName">Choose File</div>
                            <div className="file-select-name" id="noFile">No file chosen...</div>
                            <input type="file" name="chooseFile" id="chooseFile"
                                   onChange={(event) => this.onFileChange(event)}/>
                        </div>
                    </div>

                    <br/>
                    <label>
                        Comment:
                        <input id="comment" name="comment" type="text" value={this.state.comment}
                               onChange={(event) => this.handleChange(event)}/>
                    </label>
                    <br/>
                    <button onClick={(event) => this.handleSubmit(event)}>
                        Save
                    </button>
                    <br/>
                </div>
            </div>
        )
    }
}

export default withParams(NoteForm)
