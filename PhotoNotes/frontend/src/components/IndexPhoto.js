import React, {useState} from 'react';
import Carousel from 'react-bootstrap/Carousel';
import Auth from "./Authentication";
import reg from "./Registration";
import axios from "axios";
import url from "./AppURL";

class IndexPhoto extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            carousel: []
        }
    }

    componentDidMount() {

        axios.get(`${url.get()}/api/carousel/`)
            .then(response => {
                const carousel = response.data
                this.setState(
                    {
                        carousel: carousel
                    }
                )
            }).catch(error => console.log(error))
    }

    render() {
        return (
            <Carousel fade interval={3000}>
                {this.state.carousel.map((p) => {
                    return (
                        <Carousel.Item key={p.id}>
                            <img className="d-block w-100" src={p.image_url}/>
                            <Carousel.Caption>
                                {p.title}
                            </Carousel.Caption>
                        </Carousel.Item>
                    );
                })}
            </Carousel>
        )
    }
}

export default IndexPhoto
