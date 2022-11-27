import React from 'react'

const IndexPhotoItem = ({note}) => {
    return (
        <div className="col-sm">
            <img className="img-fluid img-thumbnail" src={note.image}/>
        </div>
    )
}

const IndexPhotoList = ({notes}) => {
    let indexNote = notes.filter((n) => n.use_on_index === true);
    return (
        <div className="row">
            {indexNote.map((note) => <IndexPhotoItem key={note.id} note={note}/>)}
        </div>
    )
}
export default IndexPhotoList
