import React from 'react'
import {useParams} from "react-router-dom";
import $ from "jquery";

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
            isLoadprops: false
        };
    }

    static getDerivedStateFromProps(props, state) {

        if (props.params.id && !state.isLoadprops) {
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
                            isLoadprops: true
                        };
                    }
                }
            }
        }
        // Return null to indicate no change to state.
        return null;
    }

    // componentWillReceiveProps(nextProps) {
    //     if (nextProps.notes !== this.props.notes) {
    //         const notes = nextProps.notes;
    //         let id = nextProps.params.id;
    //         if (id) {
    //             if (notes) {
    //                 let note = notes.find((n) => n.id === parseInt(id));
    //                 if (note) {
    //                     this.setState({
    //                         note: note,
    //                         title: note.title,
    //                         comment: note.photo_comment,
    //                         image: note.image
    //                     })
    //                 }
    //             }
    //         }
    //     }
    // }

    handleChange(event) {
        this.setState(
            {
                [event.target.name]: event.target.value
            }
        );
    }

    handleSubmit(event) {

        console.log(this.state.title, this.state.comment, this.state.image);

        return;

        let forms = document.querySelectorAll('.requires-validation');
        if (forms) {
            if (forms.length > 0) {
                const form = forms[0];
                if (form.checkValidity()) {

                    // TODO: Send new note to front.
                    // this.props.authData(this.state.username, this.state.password);

                } else {
                    form.classList.add('was-validated');
                }
                event.preventDefault();
                event.stopPropagation();
            }
        }
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
                    <br/>

                    {/*<div>*/}
                    {/*    <div>*/}
                    {/*        <input type="file" onChange={onFileChange}/>*/}
                    {/*        <button onClick={onFileUpload}>*/}
                    {/*            Upload!*/}
                    {/*        </button>*/}
                    {/*    </div>*/}
                    {/*    {fileData()}*/}
                    {/*</div>*/}

                    <br/>
                    <label>
                        Comment:
                        <input id="comment" name="comment" type="text" value={this.state.comment}
                               onChange={(event) => this.handleChange(event)}/>
                    </label>
                    <br/>
                    <button onClick={(event) => this.handleSubmit()}>
                        Save
                    </button>
                    <br/>
                </div>
            </div>
        )
    }
}

export default withParams(NoteForm)
