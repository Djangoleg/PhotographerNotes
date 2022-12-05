import React from "react";
import {Navbar,} from "react-bootstrap";
import appPath from "./AppPath";
import {NavLink} from "react-router-dom";


const Menu = ({auth: mainAuth}) => {

    return (
        <div className="menu">
            <div>
                <Navbar className="navbar navbar-expand-lg static-top my-navbar">
                    <div className="container-nav">
                        <a className="navbar-brand" href="/">
                            <img src="/img/logo.png" alt="..."/>
                        </a>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                                data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                                aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav ms-auto">
                                <li className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                                       data-bs-toggle="dropdown" aria-expanded="false">
                                        <img src="/img/menu.png"/>
                                    </a>
                                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                                        <li><a className="dropdown-item" href={appPath.blog}>Blog</a></li>
                                        <li>
                                            <hr className="dropdown-divider"/>
                                        </li>

                                        {mainAuth.isAuthenticated() ?
                                            <li><NavLink className="dropdown-item" to={appPath.index}
                                                         onClick={() => mainAuth.logout()}><b>{mainAuth.username}</b> Logout</NavLink>
                                            </li> :
                                            <li><a className="dropdown-item" href={appPath.login}>Login</a></li>}

                                        {!mainAuth.isAuthenticated() ?
                                            <li><a className="dropdown-item"
                                                   href={appPath.registration}>Registration</a>
                                            </li> : null}

                                        {mainAuth.isAuthenticated() ?
                                            <li><a className="dropdown-item"
                                                   href={appPath.createNote}>Create note</a>
                                            </li> : null}

                                        <li><a className="dropdown-item" href={appPath.feedback}>Feedback</a></li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </div>
                </Navbar>
            </div>
        </div>
    )
}

export default Menu