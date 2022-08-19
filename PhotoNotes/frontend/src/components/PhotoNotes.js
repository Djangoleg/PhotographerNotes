import React from 'react'

const PhotoNotesItem = ({note}) => {
    return (
        <td>
            <img src={note.image} width="500" height="600"/>
        </td>
    )
}

const PhotoNotesList = ({notes}) => {
    return (
        <table className="table-info">
            <thead>
            </thead>
            <tbody>
                <tr>
                    {notes.map((note) => <PhotoNotesItem key={note.id} note={note}/>)}
                </tr>
            </tbody>
            <tfoot>
            </tfoot>
        </table>
    )
}
export default PhotoNotesList
