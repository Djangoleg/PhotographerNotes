import React from 'react';
import appPath from "./AppPath";
import moment from "moment";

const Footer = () => {

    return (
        <div className="footer fixed-bottom">
            <div className="d-block d-flex justify-content-between m-2">
                <a className="d-inline-block nav-link ms-1" href={appPath.feedback}>
                    <img src="/img/feedback.png" alt="Feedback" />
                </a>
                <div>
                    <div className="d-inline-block align-middle">Developed By &nbsp;</div>
                    <div className="d-inline-block text-blue align-middle">
                        <div>&copy;Kro &nbsp;</div>
                    </div>
                    <div className="d-inline-block align-middle">{moment().year()}</div>
                </div>
                <a className="d-inline-block nav-link me-1" href={appPath.blog}>
                    <img src="/img/blog.png" alt="Blog" />
                </a>
            </div>
        </div>
    )
}

export default Footer