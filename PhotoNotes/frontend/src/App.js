import 'bootstrap/dist/css/bootstrap.min.css';
import './auth.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import React from 'react';
import axios from 'axios';
import $ from 'jquery';
import Popper from 'popper.js';
import logo from './logo.svg';
import {BrowserRouter, HashRouter, Routes, Router, Route} from 'react-router-dom';
import './App.css';
import appPath from "./components/AppPath";
import PhotoNotesList from "./components/PhotoNotes";
import IndexPhotoList from "./components/IndexPhoto";
import NotFound from "./components/NotFound";
import Menu from "./components/Menu";
import Footer from "./components/Footer";
import auth from "./components/Authentication";
import reg from "./components/Registration";
import LoginForm from "./components/LoginForm";
import RegForm from "./components/RegistrationForm";
import VerifyPage from "./components/VerifyPage";
import url from "./components/AppURL"
import NoteForm from "./components/NoteForm";


class PhotoNotes extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            'mainAuth': auth,
            'regData': reg,
            'notes': []
        }
    }

    componentDidMount() {

        this.state.mainAuth.getTokenFromStorage();

        axios.get(`${url.get()}/api/notes/`)
            .then(response => {
                const notes = response.data
                this.setState(
                    {
                        'notes': notes
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
                                <div
                                    className="h-100 d-flex justify-content-center align-items-center container-custom">
                                    <IndexPhotoList notes={this.state.notes}/>
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
                                <PhotoNotesList notes={this.state.notes}/>
                            </div>
                        </div>
                    }/>
                    <Route exact path={appPath.editNote} element={
                        <div className="content">
                            <NoteForm notes={this.state.notes}/>
                        </div>
                    }/>
                    <Route exact path={appPath.createNote} element={
                        <div className="content">
                            <NoteForm notes={this.state.notes}/>
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
