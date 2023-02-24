import React from 'react';
import appPath from "./AppPath";
import moment from "moment";

const Footer = () => {

    return (
        <div className="footer">
            <div className="d-block d-flex justify-content-between">
                <a className="d-inline-block nav-link ms-5 ps-5" href={appPath.feedback}>
                    <img src="/img/feedback.png" alt="Feedback" />
                </a>
                <div className="align-middle mt-1">
                    <div className="d-inline-block align-middle">Developed By &nbsp;</div>
                    <div className="d-inline-block text-blue align-middle">
                        <div>&copy;Kro &nbsp;</div>
                    </div>
                    <div className="d-inline-block align-middle">{moment().year()}</div>
                </div>
                <a className="d-inline-block nav-link me-5 pe-5" href={appPath.blog}>
                    <img src="/img/blog.png" alt="Blog" />
                </a>
            </div>
        </div>
    )
}

export default Footer