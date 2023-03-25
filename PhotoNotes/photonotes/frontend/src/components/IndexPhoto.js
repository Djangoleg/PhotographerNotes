import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import axios from "axios";
import url from "./AppURL";
import Auth from "./Authentication";

class IndexPhoto extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            carousel: []
        }
    }

    componentDidMount() {

        let headers = Auth.getHeaders();

        axios.get(`${url.get()}/api/carousel/`, {
            headers: headers,
        }).then(response => {
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
                            <img className="d-block w-100" src={p.image_url} alt=''/>
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
