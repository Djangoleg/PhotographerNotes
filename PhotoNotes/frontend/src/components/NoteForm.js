import {useParams} from "react-router-dom";
import React from "@types/react";

var NoteFormValues = {
    title: '',
    comment: '',
    image: '',
    selectedFile: null
};

const handleChange = (event) => {
    NoteFormValues[event.target.name] = event.target.value;
}

const handleSubmit = (event) => {
    let noteId = document.getElementById('noteId').innerText;
}

const onFileChange = (event) => {
    NoteFormValues.selectedFile = event.target.files[0];
};

const onFileUpload = () => {
    // Create an object of formData
    const formData = new FormData();

    formData.append(
        "myFile",
        NoteFormValues.selectedFile,
        NoteFormValues.selectedFile.name
    );

    console.log(NoteFormValues.selectedFile);

    // Request made to the backend api
    // Send formData object
    // axios.post("api/uploadfile", formData);
};

const fileData = () => {
    if (NoteFormValues.selectedFile) {

        return (
            <div>
                <h2>File Details:</h2>
                <p>File Name: {NoteFormValues.selectedFile.name}</p>
                <p>File Type: {NoteFormValues.selectedFile.type}</p>
                <p>
                    Last Modified:{" "}
                    {NoteFormValues.selectedFile.lastModifiedDate.toDateString()}
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

const NoteForm = ({notes}) => {

    let {id} = useParams();
    if (id) {
        if (notes) {
            let note = notes.find((n) => n.id === parseInt(id));
            if (note) {
                NoteFormValues.title = note.title;
                NoteFormValues.comment = note.photo_comment;
            }
        }
    }

    return (
        <div className="row">
            <div className="col-md-12">
                <div id="noteId" className="d-none">{id}</div>
                <label>
                    Title:
                    <input id="title" type="text" value={NoteFormValues.title} onChange={handleChange}/>
                </label>
                <br/>
                <div className="profile-photo text-center mb30">
                    <img className="rounded mx-auto d-block blog-img"
                         src={NoteFormValues.image} alt=''/>
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
                    <input id="comment" type="text" value={NoteFormValues.comment} onChange={handleChange}/>
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

export default NoteForm
