import './auth.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap';
import React from 'react';
import axios from 'axios';
import {BrowserRouter, HashRouter, Routes, Router, Route} from 'react-router-dom';
import './App.css';
import appPath from "./components/AppPath";
import IndexPhoto from "./components/IndexPhoto";
import NotFound from "./components/NotFound";
import Menu from "./components/Menu";
import Footer from "./components/Footer";
import auth from "./components/Authentication";
import reg from "./components/Registration";
import LoginForm from "./components/LoginForm";
import RegForm from "./components/RegistrationForm";
import VerifyPage from "./components/VerifyPage";
import url from "./components/AppURL"
import EditNoteForm from "./components/EditNoteForm";
import BlogPage from "./components/Blog";


class PhotoNotes extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            mainAuth: auth,
            regData: reg,
            notes: []
        }
    }

    componentDidMount() {

        this.state.mainAuth.getTokenFromStorage();

        axios.get(`${url.get()}/api/notes/`)
            .then(response => {
                const notes = response.data
                this.setState(
                    {
                        notes: notes
                    }
                )
            }).catch(error => console.log(error))
    }

    render() {
        return (
            <BrowserRouter>
                <Menu auth={this.state.mainAuth}/>
                <Routes>
                    <Route path={appPath.index} element={
                        <div>
                            <div className="content">
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
                                authData={(username, password) => this.state.mainAuth.login(username, password)}/>
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
                        <div className="content">
                            <div
                                className="justify-content-center align-items-center">
                                <BlogPage/>
                            </div>
                        </div>
                    }/>
                    <Route exact path={appPath.editNote} element={
                        <div className="content">
                            <EditNoteForm notes={this.state.notes}/>
                        </div>
                    }/>
                    <Route exact path={appPath.createNote} element={
                        <div className="content">
                            <EditNoteForm notes={this.state.notes}/>
                        </div>
                    }/>
                    <Route path={appPath.verify} element={
                        <div className="content">
                            <VerifyPage/>
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
