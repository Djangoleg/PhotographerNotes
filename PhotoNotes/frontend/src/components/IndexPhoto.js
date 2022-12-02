import React, {useState} from 'react';
import Carousel from 'react-bootstrap/Carousel';

const IndexPhotoList = ({notes}) => {

    let indexNotes = notes.filter((n) => n.use_on_index === true);
    return (
        <Carousel fade interval={3000}>
            {indexNotes.map((note) => {
                return (
                    <Carousel.Item key={note.id}>
                        <img className="d-block w-100" src={note.image} />
                        <Carousel.Caption>
                            {note.title}
                        </Carousel.Caption>
                    </Carousel.Item>
                );
            })}
        </Carousel>
    )
}
export default IndexPhotoList
