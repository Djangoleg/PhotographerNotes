import React from 'react';
import axios from "axios";
import url from "./AppURL";
import Moment from "moment/moment";

const IndexMiniCardsItem = ({card}) => {
    return (
        <div className="col-lg-3 col-md-6 col-padding">
            <article className="post-grid mb-3">
                <a className="post-thumb" href={`/note/view/${card.id}`}>
                    <img src={card.imageminicard} alt="" className="img-fluid w-100 shadow-lg p-2 mb-4"/>
                </a>

                <h3 className="text-center post-title-card mt-1"><a className="text-white"
                                                        href={`/note/view/${card.id}`}>{card.title}</a></h3>

                <div className="text-center text-muted letter-spacing text-uppercase font-sm text-white-50">
                    {Moment(card.created).format('LLL')}
                </div>
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
            <section className="section-padding d-flex justify-content-center">
                <div className="container-index">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <div className="row">
                            {this.state.cards.length > 0 ?
                                this.state.cards.map((card, i) =>
                                    <IndexMiniCardsItem key={i} card={card}/>) : null}
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}

export default IndexMiniCards;

