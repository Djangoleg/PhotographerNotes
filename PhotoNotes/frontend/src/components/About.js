import '../about.css';
import React from 'react';
import appPath from "./AppPath";

class AboutPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            about: '',
            title: ''
        }
    }

    render() {
        return (
            <div>
                <div className="d-flex align-items-center vh-100 justify-content-between">
                    <div className="shape_left"></div>
                    <img className="zindex-1 col-12 col-md-3 col-lg-3 ms-3" src="/img/wfs-646x861.jpg" alt=""/>
                    <div className="container-fluid">
                        <div className="d-flex justify-content-center ">
                            <div className="col-8 zindex-1 text-center">
                                <div className="text-center">
                                    <div className="mt-1">
                                        <h2>My photo notes</h2>
                                    </div>
                                    <div className="text-black fw-bold text-wrap">
                                        The My Photo Notes project was created for all photography lovers. Here you can place your favorite photographs or other graphic works, make descriptions and tags for them. You can comment on the work of other authors. All rights reserved.
                                    </div>
                                    <div>
                                        <a className="btn btn-primary m-5" href={appPath.feedback}>Feedback</a></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <img className="zindex-1 col-12 col-md-3 col-lg-3 mx-3" src="/img/wf-646x861.jpg" alt=""/>
                    <div className="shape_right"></div>
                </div>
            </div>

        )
    }
}

export default AboutPage;
