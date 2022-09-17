import React from 'react';
import {
    useParams
} from "react-router-dom";

const handleChange = (event) => {
    this.setState({value: event.target.value});
}

const handleSubmit = (event) => {
    let noteId = document.getElementById('noteId').innerText;
    let title = event.target.elements.title.value;
    let comment = event.target.elements.comment.value;

}


const Note = ({notes}) => {

    let {id} = useParams();

    let note;

    if (id) {
        note = notes.find((n) => n.id === parseInt(id));
    }

    return (
        <form onSubmit={handleSubmit}>
            <div id="noteId" className="d-none">{id}</div>
            <label>
                Title:
                <input id="title" type="text" value={note ? note.title : ''} onChange={handleChange}/>
            </label>
            <label>
                Comment:
                <input id="comment" type="text" value={note ? note.photo_comment : ''} onChange={handleChange}/>
            </label>
            <input type="submit" value="Submit"/>
        </form>
    );
}

export default Note