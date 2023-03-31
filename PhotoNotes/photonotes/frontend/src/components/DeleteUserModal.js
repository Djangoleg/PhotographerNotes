import React, {useState} from "react";
import Auth from "./Authentication";
import axios from "axios";
import url from "./AppURL";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import appPath from "./AppPath";

const DeleteUserModal = () => {
    let auth = Auth;
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);
    const handleDelete = () => {
        let headers = auth.getHeaders();
        let apiUrl = `${url.get()}/api/users/${auth.user}/`;
        axios.delete(apiUrl, {
            headers: headers,
        }).then(() => {
            setShow(false);
            auth.logoutWithRedirect(appPath.index);
        }).catch(error => {
            setShow(false);
            console.log(error);
            alert('Error delete user!');
        });
    }

    return (
        <div className="d-inline-block">
            <input type="button"
                   className="btn btn-danger ms-2"
                   value="Delete user"
                   onClick={handleShow}/>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Deleting a user</Modal.Title>
                </Modal.Header>
                <Modal.Body>User "{auth.username}" will be deleted! All notes will also be deleted.</Modal.Body>
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

export default DeleteUserModal;