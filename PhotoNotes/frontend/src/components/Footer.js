import React from 'react';
import appPath from "./AppPath";

const Footer = () => {

    return (
        <div className="footer mt-5 fixed-bottom">
            <div className="container section">
                <div className="row">
                    <div className="col-lg-10 mx-auto text-center">
                        <a className="d-inline-block mb-4 pb-2" href={appPath.index}>
                            <img loading="prelaod" decoding="async" className="img-fluid" src="img/logo.png"/>
                        </a>
                        <ul className="p-0 d-flex navbar-footer mb-0 list-unstyled">
                            <li className="nav-item my-0"><a className="nav-link m-lg-1" href={appPath.blog}>Blog</a></li>
                            <li className="nav-item my-0"><a className="nav-link m-lg-1" href={appPath.feedback}>Feedback</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="copyright bg-dark">Developed By <a
                href={appPath.index}>&copy; Kro</a></div>
        </div>
    )
}

export default Footer