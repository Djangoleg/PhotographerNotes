import '../notfound.css';
import React from 'react';
import {useNavigate} from "react-router-dom";

const NotFound = () => {

    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1);
    }

    return (
        <div>
            <div className="container-notfound container-star">
                <div className="star-1"></div>
                <div className="star-1"></div>
                <div className="star-1"></div>
                <div className="star-1"></div>
                <div className="star-1"></div>
                <div className="star-1"></div>
                <div className="star-1"></div>
                <div className="star-1"></div>
                <div className="star-1"></div>
                <div className="star-1"></div>
                <div className="star-1"></div>
                <div className="star-1"></div>
                <div className="star-1"></div>
                <div className="star-1"></div>
                <div className="star-1"></div>
                <div className="star-1"></div>
                <div className="star-1"></div>
                <div className="star-1"></div>
                <div className="star-1"></div>
                <div className="star-1"></div>
                <div className="star-1"></div>
                <div className="star-1"></div>
                <div className="star-1"></div>
                <div className="star-1"></div>
                <div className="star-1"></div>
                <div className="star-1"></div>
                <div className="star-1"></div>
                <div className="star-1"></div>
                <div className="star-1"></div>
                <div className="star-1"></div>
                <div className="star-2"></div>
                <div className="star-2"></div>
                <div className="star-2"></div>
                <div className="star-2"></div>
                <div className="star-2"></div>
                <div className="star-2"></div>
                <div className="star-2"></div>
                <div className="star-2"></div>
                <div className="star-2"></div>
                <div className="star-2"></div>
                <div className="star-2"></div>
                <div className="star-2"></div>
                <div className="star-2"></div>
                <div className="star-2"></div>
                <div className="star-2"></div>
                <div className="star-2"></div>
                <div className="star-2"></div>
                <div className="star-2"></div>
                <div className="star-2"></div>
                <div className="star-2"></div>
                <div className="star-2"></div>
                <div className="star-2"></div>
                <div className="star-2"></div>
                <div className="star-2"></div>
                <div className="star-2"></div>
                <div className="star-2"></div>
                <div className="star-2"></div>
                <div className="star-2"></div>
                <div className="star-2"></div>
                <div className="star-2"></div>
            </div>
            <div className="container-notfound container-bird">
                <div className="bird bird-anim">
                    <div className="bird-container">
                        <div className="wing wing-left">
                            <div className="wing-left-top"></div>
                        </div>
                        <div className="wing wing-right">
                            <div className="wing-right-top"></div>
                        </div>
                    </div>
                </div>
                <div className="bird bird-anim">
                    <div className="bird-container">
                        <div className="wing wing-left">
                            <div className="wing-left-top"></div>
                        </div>
                        <div className="wing wing-right">
                            <div className="wing-right-top"></div>
                        </div>
                    </div>
                </div>
                <div className="bird bird-anim">
                    <div className="bird-container">
                        <div className="wing wing-left">
                            <div className="wing-left-top"></div>
                        </div>
                        <div className="wing wing-right">
                            <div className="wing-right-top"></div>
                        </div>
                    </div>
                </div>
                <div className="bird bird-anim">
                    <div className="bird-container">
                        <div className="wing wing-left">
                            <div className="wing-left-top"></div>
                        </div>
                        <div className="wing wing-right">
                            <div className="wing-right-top"></div>
                        </div>
                    </div>
                </div>
                <div className="bird bird-anim">
                    <div className="bird-container">
                        <div className="wing wing-left">
                            <div className="wing-left-top"></div>
                        </div>
                        <div className="wing wing-right">
                            <div className="wing-right-top"></div>
                        </div>
                    </div>
                </div>
                <div className="bird bird-anim">
                    <div className="bird-container">
                        <div className="wing wing-left">
                            <div className="wing-left-top"></div>
                        </div>
                        <div className="wing wing-right">
                            <div className="wing-right-top"></div>
                        </div>
                    </div>
                </div>
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
                    <button onClick={goBack}>Go back</button>
                </div>
            </div>
        </div>
    )
}

export default NotFound
