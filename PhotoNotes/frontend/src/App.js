import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import React from 'react';
import axios from 'axios';
import $ from 'jquery';
import Popper from 'popper.js';
import logo from './logo.svg';
import {BrowserRouter, HashRouter, Routes, Router, Route} from 'react-router-dom';
import './App.css';
import appPath from "./AppPath";
import PhotoNotesList from "./components/PhotoNotes";
import IndexPhotoList from "./components/IndexPhoto";
import NotFound from "./components/NotFound";
import Menu from "./components/Menu";
import Footer from "./components/Footer";
import Note from "./components/Note";
import auth from "./Authentication";


class PhotoNotes extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            'mainAuth': auth,
            'notes': []
        }
    }

    componentDidMount() {
        axios.get(`http://${window.location.hostname}:8000/api/notes/`)
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
                    <Route exact path={appPath.blog} element={
                        <div className="content">
                            <div
                                className="justify-content-center align-items-center">
                                <PhotoNotesList notes={this.state.notes}/>
                            </div>
                        </div>
                    }/>
                    <Route exact path={appPath.notes} element={
                        <div className="content">
                            <Note notes={this.state.notes}/>
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
