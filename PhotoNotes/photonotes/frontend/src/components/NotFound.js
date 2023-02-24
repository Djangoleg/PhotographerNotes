import '../notfound.css';
import React from 'react';
import {useNavigate} from "react-router-dom";

const NotFound = () => {

    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1);
    }

    return (
        <section className="h-100 bg-black">
            <header className="container h-100">
                <div className="d-flex align-items-center justify-content-center h-100">
                    <div className="d-flex flex-column fof">
                        <h1 className="text align-self-center p-2">Error 404</h1>
                        <button className="button-not-found" onClick={goBack}>Go back</button>
                    </div>
                </div>
            </header>
        </section>
    )
}

export default NotFound
