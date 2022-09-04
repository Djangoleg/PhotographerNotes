import {useLocation} from "react-router-dom";
import React from 'react';

const NotFound = () => {

    let location = useLocation();

    return (
        <div className="h-100 d-flex justify-content-center align-items-center">
            <h3>Page '{location.pathname}' not found</h3>
        </div>
    )
}

export default NotFound
