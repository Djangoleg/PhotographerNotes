import '../notfound.css';
import React from 'react';
import {useNavigate} from "react-router-dom";

const NotFound = () => {

    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1);
    }

    let stars = [];
    for (let i = 0; i < 60; i++) {
        stars.push(<div key={i} className={i % 2 == 0 ? "star-" + 2 : "star-" + 1}></div>);
    }

    let birds = [];
    for (let i = 0; i < 7; i++) {
        birds.push(
            <div key={i} className="bird bird-anim">
                <div className="bird-container">
                    <div className="wing wing-left">
                        <div className="wing-left-top"></div>
                    </div>
                    <div className="wing wing-right">
                        <div className="wing-right-top"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="container-notfound container-star">
                {stars}
            </div>
            <div className="container-notfound container-bird">
                {birds}
                <div className="container-title">
                    <div className="title">
                        <div className="number">4</div>
                        <div className="moon">
                            <div className="face">
                                <div className="mouth"></div>
                                <div className="eyes">
                                    <div className="eye-left"></div>
                                    <div className="eye-right"></div>
                                </div>
                            </div>
                        </div>
                        <div className="number">4</div>
                    </div>
                    <div className="subtitle">Oops. Looks like you took a wrong turn.</div>
                    <button className="button-not-found" onClick={goBack}>Go back</button>
                </div>
            </div>
        </div>
    )
}

export default NotFound
