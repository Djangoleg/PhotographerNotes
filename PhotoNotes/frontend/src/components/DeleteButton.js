import React, {useState} from "react";
import Auth from "./Authentication";
import axios from "axios";
import url from "./AppURL";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import {useNavigate} from "react-router-dom";
import appPath from "./AppPath";

const DeleteButton = ({note}) => {
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);
    const handleDelete = () => {
        let headers = Auth.getHeaders();
        axios.delete(`${url.get()}/api/notes/${note.id}/`, {
            headers: headers,
        }).then(() => {
            setShow(false);

            if (window.location.pathname.includes('blog')) {
                window.location.reload();
            } else {
                navigate(appPath.blog);
            }

        }).catch(error => {
            setShow(false);
            console.log(error);
            alert('Error change or create note!');
        });
    }

    return (
        <div className="d-inline-block">
            <Button type="submit" className="btn btn-primary ms-1" onClick={handleShow}>
                Delete
            </Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Deleting a note</Modal.Title>
                </Modal.Header>
                <Modal.Body>Note "{note.title}" will be deleted!</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default DeleteButton;