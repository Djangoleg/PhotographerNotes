import React, {useState} from 'react';
import {useParams} from "react-router-dom";

var state = {

    // Initially, no file is selected
    selectedFile: null
};

const handleChange = (event) => {
    this.setState({value: event.target.value});
}

const handleSubmit = (event) => {
    let noteId = document.getElementById('noteId').innerText;
    // let title = event.target.elements.title.value;
    // let comment = event.target.elements.comment.value;

}

// On file select (from the pop up)
const onFileChange = event => {
    // Update the state
    state.selectedFile = event.target.files[0]

};

// On file upload (click the upload button)
const onFileUpload = () => {
    // Create an object of formData
    const formData = new FormData();

    // Update the formData object
    formData.append(
        "myFile",
        state.selectedFile,
        state.selectedFile.name
    );

    // Details of the uploaded file
    console.log(state.selectedFile);

    // Request made to the backend api
    // Send formData object
    // axios.post("api/uploadfile", formData);
};

// File content to be displayed after
// file upload is complete
const fileData = () => {
    if (state.selectedFile) {

        return (
            <div>
                <h2>File Details:</h2>
                <p>File Name: {state.selectedFile.name}</p>
                <p>File Type: {state.selectedFile.type}</p>
                <p>
                    Last Modified:{" "}
                    {state.selectedFile.lastModifiedDate.toDateString()}
                </p>
            </div>
        );
    } else {
        return (
            <div>
                <br/>
                <h4>Choose before Pressing the Upload button</h4>
            </div>
        );
    }
};

const Note = ({notes}) => {

    let {id} = useParams();

    let note;

    if (id) {
        note = notes.find((n) => n.id === parseInt(id));
    }

    return (
        <div className="row">
            <div className="col-md-12">
                <div id="noteId" className="d-none">{id}</div>
                <label>
                    Title:
                    <input id="title" type="text" value={note ? note.title : ''} onChange={handleChange}/>
                </label>
                <br/>
                <div className="profile-photo text-center mb30">
                    <img className="rounded mx-auto d-block blog-img"
                         src={note ? note.image : ''} alt=''/>
                </div>
                <br/>

                <div>
                    <div>
                        <input type="file" onChange={onFileChange}/>
                        <button onClick={onFileUpload}>
                            Upload!
                        </button>
                    </div>
                    {fileData()}
                </div>

                <br/>
                <label>
                    Comment:
                    <input id="comment" type="text" value={note ? note.photo_comment : ''} onChange={handleChange}/>
                </label>
                <br/>
                <button onClick={handleSubmit}>
                    Save
                </button>
                <br/>
            </div>
        </div>
    );
}

export default Note