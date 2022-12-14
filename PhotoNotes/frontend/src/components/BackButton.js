import React from "react";
import {useNavigate} from "react-router-dom";

const BackButton = () => {

    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1);
    }

    return (
        <div className="d-inline-block">
            <button
                type="submit"
                className="btn btn-primary"
                onClick={goBack}>
                Back
            </button>
        </div>
    )
}

export default BackButton;
