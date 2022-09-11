import React from 'react'

const IndexPhotoItem = ({note}) => {
    return (
        <div className="col-sm">
            <img className="img-fluid img-thumbnail" src={note.image}/>
        </div>
    )
}

const IndexPhotoList = ({notes}) => {
    return (
        <div className="row">
            {notes.map((note) => <IndexPhotoItem key={note.id} note={note}/>)}
        </div>
    )
}
export default IndexPhotoList
