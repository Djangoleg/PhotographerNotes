import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import React from 'react';
import axios from 'axios'
import $ from 'jquery';
import Popper from 'popper.js';
import logo from './logo.svg';
import './App.css';
import PhotoNotesList from "./components/PhotoNotes";

class PhotoNotes extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            'notes': []
        }
    }

    componentDidMount() {
        axios.get('http://127.0.0.1:8000/api/notes/')
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
            <div>
                <PhotoNotesList notes={this.state.notes}/>
            </div>
        )
    }
}

export default PhotoNotes;
