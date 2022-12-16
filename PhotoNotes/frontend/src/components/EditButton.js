import Button from "react-bootstrap/Button";
import React from "react";
import {useNavigate} from "react-router-dom";

const EditButton = ({noteId, tag, page}) => {

    const navigate = useNavigate();

    const goNoteEdit = () => {
        navigate(`/note/${noteId}/${tag}/${page}`);
    }

    return (
        <div className="d-inline-block">
            <Button type="submit" className="btn btn-primary ms-1" onClick={goNoteEdit}>
                Edit
            </Button>
        </div>
    )
}

export default EditButton;