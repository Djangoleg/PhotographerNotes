import React from 'react';
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
        const notes = [
            {
                'title': 'Хорошее фото №1',
                'image': 'http://127.0.0.1:8000/media/post_photo/1.jpg',
                'photo_comment': 'Люблю гулять и прохлаждаться 1'
            },
            {
                'title': 'Хорошее фото №2',
                'image': 'http://127.0.0.1:8000/media/post_photo/2.jpg',
                'photo_comment': 'Люблю гулять и прохлаждаться 2'
            },
        ]
        this.setState(
            {
                'notes': notes
            }
        )
    }

    render() {
        return (
            <div>
                <PhotoNotesList notes={this.state.notes} />
            </div>
        )
    }
}

export default PhotoNotes;
