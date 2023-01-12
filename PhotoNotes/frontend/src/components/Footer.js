import React from 'react';
import appPath from "./AppPath";
import moment from "moment";

const Footer = () => {

    return (
        <div className="footer fixed-bottom">
            <div className="d-block d-flex justify-content-between m-2">
                <a className="d-inline-block nav-link ms-5" href={appPath.feedback}>Feedback</a>
                <div>
                    <div className="d-inline-block">Developed By &nbsp;</div>
                    <div className="d-inline-block text-blue">
                        <div>&copy;Kro &nbsp;</div>
                    </div>
                    <div className="d-inline-block">{moment().year()}</div>
                </div>
                <a className="d-inline-block nav-link me-5" href={appPath.blog}>Blog</a>
            </div>
        </div>
    )
}

export default Footer