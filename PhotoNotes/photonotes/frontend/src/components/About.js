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
            <section className="d-flex justify-content-center mt-5">
                <div className="container-fluid d-flex align-items-center justify-content-between">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <div className="row mb-5">
                            {/*<div className="container d-flex align-items-center col-12 col-md-3 col-lg-3">*/}
                            {/*    <img className="" src="/img/wfs-646x861.jpg" alt=""/>*/}
                            {/*</div>*/}
                            <div
                                className="container col-12 col-md-6 col-lg-5 mt-4 text-white text-center text-wrap">
                                <h2 className="text-white">My photo notes</h2>
                                The My Photo Notes project was created for all photography lovers.
                                Here you can place your favorite photographs or other graphic works,
                                make descriptions and tags for them. You can comment on the work of other
                                authors. The site is currently under development. For loss of data,
                                the development team is not responsible. Developed By &copy;Kro. All rights
                                reserved.
                                <div>
                                    <a className="btn btn-primary mt-4 mb-5" href={appPath.feedback}>Feedback</a></div>
                            </div>
                            {/*<div className="container d-flex align-items-center col-12 col-md-3 col-lg-3">*/}
                            {/*    <img className="" src="/img/wf-646x861.jpg" alt=""/>*/}
                            {/*</div>*/}
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}

export default AboutPage;
