import React, {useState} from 'react';
import Carousel from 'react-bootstrap/Carousel';
import axios from "axios";
import url from "./AppURL";
import Constants from "./AppConstants";
import Moment from "moment/moment";

const IndexMiniCardsItem = ({card}) => {
    return (
        <div className="col-lg-3 col-md-6 col-padding">
            <article className="post-grid mb-5">
                <a className="post-thumb mb-4 d-block" href={`/note/view/${card.id}`}>
                    <img src={card.image} alt="" className="img-fluid w-100"/>
                </a>
                {/*<span className="cat-name text-color font-extra text-sm text-uppercase letter-spacing-1">Explore</span>*/}
                <h3 className="post-title-card mt-1"><a className="text-white" href={`/note/view/${card.id}`}>{card.title}</a></h3>

                <span className="text-muted letter-spacing text-uppercase font-sm text-white-50">{Moment(card.modified).format('LLL')}</span>

            </article>
        </div>
    );
}

class IndexMiniCards extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            cards: []
        }
    }

    componentDidMount() {

        // TODO: Add new drf app for mini card.

        axios.get(`${url.get()}/api/minicards/`)
            .then(response => {
                const cards = response.data
                this.setState(
                    {
                        cards: cards
                    }
                )
            }).catch(error => console.log(error))
    }

    render() {
        return (
            <section className="section-padding webkit-center">
                <div className="container-index">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <div className="row">
                            {this.state.cards.map((card, i) =>
                                        <IndexMiniCardsItem key={i} card={card} />)}
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}

export default IndexMiniCards;

