import Button from "react-bootstrap/Button";
import React from "react";

const EditButton = ({noteId, tag, page}) => {
    return (
        <div className="d-inline-block">
            <Button type="submit" className="btn btn-primary ms-1" href={`/note/${noteId}/${tag}/${page}`}>
                Edit
            </Button>
        </div>
    )
}

export default EditButton;