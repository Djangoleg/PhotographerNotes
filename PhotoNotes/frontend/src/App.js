import './auth.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap';
import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import './App.css';
import appPath from "./components/AppPath";
import IndexPhoto from "./components/IndexPhoto";
import NotFound from "./components/NotFound";
import Menu from "./components/Menu";
import Footer from "./components/Footer";
import Auth from "./components/Authentication";
import reg from "./components/Registration";
import LoginForm from "./components/LoginForm";
import RegForm from "./components/RegistrationForm";
import VerifyPage from "./components/VerifyPage";
import EditNoteForm from "./components/EditNoteForm";
import BlogPage from "./components/Blog";
import FeedbackForm from "./components/FeedbackForm";


class PhotoNotes extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            regData: reg
        }
    }

    render() {
        return (
            <BrowserRouter>
                <Menu />
                <Routes>
                    <Route path={appPath.index} element={
                        <div>
                            <div className="content bg position-fixed">
                                <div className="h-100 justify-content-lg-center align-items-lg-start">
                                    <IndexPhoto/>
                                </div>
                            </div>
                            <Footer/>
                        </div>
                    }/>
                    <Route exact path={appPath.login} element={
                        <div>
                            <LoginForm
                                authData={(username, password) => Auth.login(username, password)}/>
                        </div>
                    }/>
                    <Route exact path={appPath.registration} element={
                        <div>
                            <RegForm
                                redData={(username, password, email, firstname, lastname) =>
                                    this.state.regData.sendRegData(username, password, email, firstname, lastname)}/>
                        </div>
                    }/>
                    <Route exact path={appPath.blog} element={
                        <div className="content bg-blog">
                            <div className="justify-content-center align-items-center">
                                <BlogPage/>
                            </div>
                        </div>
                    }/>
                    <Route exact path={appPath.editNote} element={
                        <div className="content">
                            <EditNoteForm />
                        </div>
                    }/>
                    <Route exact path={appPath.createNote} element={
                        <div className="content">
                            <EditNoteForm />
                        </div>
                    }/>
                    <Route path={appPath.verify} element={
                        <div className="content">
                            <VerifyPage/>
                        </div>
                    }/>
                    <Route path={appPath.feedback} element={
                        <div>
                            <div className="content">
                                <FeedbackForm/>
                            </div>
                            <Footer/>
                        </div>
                    }/>

                    <Route path={appPath.any} element={
                        <div>
                            <div className="content">
                                <NotFound/>
                            </div>
                            <Footer/>
                        </div>
                    }/>
                </Routes>

            </BrowserRouter>
        )
    }
}

export default PhotoNotes;
