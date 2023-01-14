import React from "react";
import {Navbar,} from "react-bootstrap";
import appPath from "./AppPath";
import {NavLink} from "react-router-dom";
import Auth from "./Authentication";


const Menu = () => {
    let myAuth = Auth;
    myAuth.getTokenFromStorage();
    return (
        <div className="menu">
            <div>
                <Navbar className="navbar navbar-expand-lg static-top my-navbar">
                    <div className="container-nav">

                        <a className="navbar-brand" href={appPath.index}>
                            <img src="/img/logo.png" alt="..."/>
                        </a>
                        <img src="/img/Rock32.svg" alt=""/>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                                data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                                aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav ms-auto">
                                <img src="/img/Rica32.svg" alt=""/>
                                <li className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle ms-3" href="#" id="navbarDropdown"
                                       role="button"
                                       data-bs-toggle="dropdown" aria-expanded="false">
                                        <img src="/img/menu.png"/>
                                    </a>
                                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                                        <li><a className="dropdown-item"
                                               href={appPath.blog}>Blog</a></li>
                                        {myAuth.isAuthenticated() ?
                                            <li><a className="dropdown-item"
                                                   href={appPath.createNote}>Create note</a>
                                            </li> : null}
                                        <li>
                                            <hr className="dropdown-divider"/>
                                        </li>

                                        {myAuth.isAuthenticated() ?
                                            <li><NavLink className="dropdown-item" to={appPath.index}
                                                         onClick={() => Auth.logout()}><b>{Auth.username}</b> Logout</NavLink>
                                            </li> :
                                            <li><a className="dropdown-item" href={appPath.login}>Login</a></li>}

                                        {myAuth.isAuthenticated() ?
                                            <li><a className="dropdown-item"
                                                   href={`/profile/view/${myAuth.profile}`}>Profile</a>
                                            </li> : null}

                                        {!myAuth.isAuthenticated() ?
                                            <li><a className="dropdown-item"
                                                   href={appPath.registration}>Registration</a>
                                            </li> : null}
                                        <li><a className="dropdown-item"
                                               href={appPath.recoveryPwd}>Password recovery</a>
                                        </li>
                                        <li>
                                            <hr className="dropdown-divider"/>
                                        </li>
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