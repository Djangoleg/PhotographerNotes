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
import AboutPage from "./components/About";


class PhotoNotes extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            blogSelectedTag: '',
            blogSelectedPage: '',
            blogSelectedUser: ''
        }
    }

    render() {
        return (
            <BrowserRouter>
                <Menu/>
                <Routes>
                    <Route path={appPath.index} element={
                        <>
                            <div className="content bg-blog">
                                <div className="h-100 justify-content-lg-center align-items-lg-start">
                                    <IndexPhoto/>
                                    <IndexMiniCards/>
                                </div>
                            </div>
                            <Footer/>
                        </>
                    }/>
                    <Route exact path={appPath.login} element={
                        <>
                            <div className="content">
                                <LoginForm
                                    authData={(username, password) => Auth.login(username, password)}/>
                            </div>
                            <Footer/>
                        </>
                    }/>
                    <Route exact path={appPath.registration} element={
                        <>
                            <div className="content">
                                <RegForm/>
                            </div>
                            <Footer/>
                        </>
                    }/>
                    <Route exact path={appPath.blog} element={
                        <>
                            <div className="content bg-blog">
                                <div className="justify-content-center align-items-center">
                                    <BlogPage
                                        selectedTag={this.state.blogSelectedTag}
                                        selectedPage={this.state.blogSelectedPage}
                                        selectedUser={this.state.blogSelectedUser}

                                        pageData={(selectedTag, selectedPage, selectedUser) => {
                                            this.setState({
                                                blogSelectedTag: selectedTag,
                                                blogSelectedPage: selectedPage,
                                                blogSelectedUser: selectedUser
                                            });
                                        }}/>
                                </div>
                            </div>
                            <Footer/>
                        </>
                    }/>
                    <Route exact path={appPath.editNote} element={
                        <>
                            <div className="content">
                                <EditNoteForm
                                    pagetitle="Edit Note"
                                    pageData={(selectedTag, selectedPage, selectedUser) => {
                                        this.setState({
                                            blogSelectedTag: selectedTag,
                                            blogSelectedPage: selectedPage,
                                            blogSelectedUser: selectedUser
                                        });
                                    }}
                                />
                            </div>
                            <Footer/>
                        </>
                    }/>
                    <Route exact path={appPath.viewNote} element={
                        <>
                            <div className="content bg-blog">
                                <NotePage
                                    pageData={(selectedTag, selectedPage, selectedUser) => {
                                        this.setState({
                                            blogSelectedTag: selectedTag,
                                            blogSelectedPage: selectedPage,
                                            blogSelectedUser: selectedUser
                                        });
                                    }}
                                />
                            </div>
                            <Footer/>
                        </>
                    }/>
                    <Route exact path={appPath.createNote} element={
                        <>
                            <div className="content">
                                <EditNoteForm
                                    pagetitle="Create Note"
                                    pageData={(selectedTag, selectedPage, selectedUser) => {
                                        this.setState({
                                            blogSelectedTag: selectedTag,
                                            blogSelectedPage: selectedPage,
                                            blogSelectedUser: selectedUser
                                        });
                                    }}
                                />
                            </div>
                            <Footer/>
                        </>
                    }/>
                    <Route path={appPath.verify} element={
                        <>
                            <div className="content">
                                <div className="bg-blog position-fixed w-100">
                                    <EmailVerification/>
                                </div>
                            </div>
                            <Footer/>
                        </>
                    }/>
                    <Route path={appPath.feedback} element={
                        <>
                            <div className="content pb-5">
                                <FeedbackForm/>
                            </div>
                            <Footer/>
                        </>
                    }/>
                    <Route path={appPath.profile} element={
                        <>
                            <div className="content">
                                <UseProfile/>
                            </div>
                            <Footer/>
                        </>
                    }/>
                    <Route path={appPath.checkkey} element={
                        <>
                            <div className="content">
                                <SettingNewPwd/>
                            </div>
                            <Footer/>
                        </>
                    }/>
                    <Route path={appPath.recoveryPwd} element={
                        <>
                            <div className="content">
                                <RecoveryPwd/>
                            </div>
                            <Footer/>
                        </>
                    }/>
                    <Route path={appPath.about} element={
                        <>
                            <div className="content bg-about">
                                <AboutPage/>
                            </div>
                            <Footer/>
                        </>
                    }/>

                    <Route path={appPath.any} element={
                        <>
                            <div className="content">
                                <NotFound/>
                            </div>
                            <Footer/>
                        </>
                    }/>
                </Routes>
            </BrowserRouter>
        )
    }
}

export default PhotoNotes;
