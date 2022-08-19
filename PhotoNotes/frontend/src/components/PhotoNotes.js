import React from 'react'

const PhotoNotesItem = ({note}) => {
    return (
        <tr>
            <td>
                {note.title}
            </td>
            <td>
                <img src={note.image} width="200" height="300"/>
            </td>
            <td>
                {note.photo_comment}
            </td>
        </tr>
    )
}

const PhotoNotesList = ({notes}) => {
    return (
        <table>
            <th>
                Title
            </th>
            <th>
                Image
            </th>
            <th>
                Post
            </th>
            {notes.map((note) => <PhotoNotesItem note={note}/>)}
        </table>
    )
}
export default PhotoNotesList
