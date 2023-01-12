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
import LoginForm from "./components/LoginForm";
import RegForm from "./components/RegistrationForm";
import EditNoteForm from "./components/EditNoteForm";
import BlogPage from "./components/Blog";
import FeedbackForm from "./components/FeedbackForm";
import NotePage from "./components/NotePage";
import IndexMiniCards from "./components/IndexMiniCard";
import UseProfile from "./components/UserProfile";
import SettingNewPwd from "./components/SettingNewPwd";
import RecoveryPwd from "./components/RecoveryPwd";
import EmailVerification from "./components/VerifyPage";


class PhotoNotes extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            blogSelectedTag: '',
            blogSelectedPage: ''
        }
    }

    render() {
        return (
            <BrowserRouter>
                <Menu/>
                <Routes>
                    <Route path={appPath.index} element={
                        <div>
                            <div className="content bg-blog">
                                <div className="h-100 justify-content-lg-center align-items-lg-start">
                                    <IndexPhoto/>
                                    <IndexMiniCards/>
                                    <Footer />
                                </div>
                            </div>
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
                            <RegForm/>
                        </div>
                    }/>
                    <Route exact path={appPath.blog} element={
                        <div className="content bg-blog">
                            <div className="justify-content-center align-items-center">
                                <BlogPage
                                    selectedTag={this.state.blogSelectedTag}
                                    selectedPage={this.state.blogSelectedPage}

                                    pageData={(selectedTag, selectedPage) => {
                                        this.setState({
                                            blogSelectedTag: selectedTag,
                                            blogSelectedPage: selectedPage
                                        });
                                    }}/>
                            </div>
                        </div>
                    }/>
                    <Route exact path={appPath.editNote} element={
                        <div className="content">
                            <EditNoteForm
                                pagetitle="Edit Note"
                                pageData={(selectedTag, selectedPage) => {
                                    this.setState({
                                        blogSelectedTag: selectedTag,
                                        blogSelectedPage: selectedPage
                                    });
                                }}
                            />
                        </div>
                    }/>
                    <Route exact path={appPath.viewNote} element={
                        <div className="content bg-blog">
                            <NotePage
                                pageData={(selectedTag, selectedPage) => {
                                    this.setState({
                                        blogSelectedTag: selectedTag,
                                        blogSelectedPage: selectedPage
                                    });
                                }}
                            />
                        </div>
                    }/>
                    <Route exact path={appPath.createNote} element={
                        <div className="content">
                            <EditNoteForm
                                pagetitle="Create Note"
                                pageData={(selectedTag, selectedPage) => {
                                    this.setState({
                                        blogSelectedTag: selectedTag,
                                        blogSelectedPage: selectedPage
                                    });
                                }}
                            />
                        </div>
                    }/>
                    <Route path={appPath.verify} element={
                        <div className="bg-blog position-fixed w-100">
                            <EmailVerification/>
                        </div>
                    }/>
                    <Route path={appPath.feedback} element={
                        <div>
                            <div className="content pb-5">
                                <FeedbackForm/>
                            </div>
                            <Footer/>
                        </div>
                    }/>
                    <Route path={appPath.profile} element={
                        <div className="content">
                            <UseProfile/>
                        </div>
                    }/>
                    <Route path={appPath.checkkey} element={
                        <div className="content">
                            <SettingNewPwd/>
                        </div>
                    }/>
                    <Route path={appPath.recoveryPwd} element={
                        <div className="content">
                            <RecoveryPwd/>
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
