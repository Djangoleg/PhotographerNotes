import React from "react";
import appPath from "./AppPath";
import {useNavigate, useParams} from "react-router-dom";
import auth from "./Authentication";
import axios from "axios";
import url from "./AppURL";

const withParams = (Component) => {
    return props => <Component {...props} params={useParams()} navigate={useNavigate()}/>;
}

class FeedbackForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            body: '',
            communication: ''
        };
    }

    handleChange = (event) => {
        this.setState(
            {
                [event.target.name]: event.target.value
            }
        );
    }

    backSubmit = (event) => {
        this.props.navigate(appPath.index);
    }

    handleSubmit = (event) => {

        let headers = auth.getHeaders();

        let data = new FormData();
        data.append('title', this.state.title);
        data.append('body', this.state.body);
        data.append('communication', this.state.communication);

        // Send feedback.
        axios.post(`${url.get()}/api/feedback/`,
            data,
            {
                headers: headers,
            }).then(response => {
            this.props.navigate(appPath.index);
        }).catch(error => {
            console.log(error);
            alert('Error change or create note!');
        });
    }

    render() {
        return (
            <div className="container mt-4 mb-4">
                <div className="col-lg-12 text-lg-center">
                    <h2>Feedback</h2>
                </div>
                <div className="col-lg-12">
                    <form role="form">
                        <div className="form-group row">
                            <label className="col-lg-3 col-form-label form-control-label">Title</label>
                            <div className="col-lg-9">
                                <input className="form-control" id="title" name="title" type="text"
                                       placeholder="Enter title"
                                       value={this.state.title}
                                       onChange={(event) => this.handleChange(event)}/>
                            </div>
                        </div>
                        <br/>
                        <div className="form-group row">
                            <label className="col-lg-3 col-form-label form-control-label">Communication</label>
                            <div className="col-lg-9">
                                <input className="form-control" id="communication" name="communication" type="text"
                                       placeholder="Enter communication"
                                       value={this.state.communication}
                                       onChange={(event) => this.handleChange(event)}/>
                            </div>
                        </div>
                        <br/>
                        <div className="form-group row">
                            <label className="col-lg-3 col-form-label form-control-label">Body</label>
                            <div className="col-lg-9">
                                <textarea className="form-control" id="body" name="body"
                                          rows="8" placeholder="Enter message.."
                                          value={this.state.body}
                                          onChange={(event) => this.handleChange(event)}/>
                            </div>
                        </div>
                        <br/>
                        <div className="form-group row">
                            <label className="col-lg-3 col-form-label form-control-label"></label>
                            <div className="col-lg-9">
                                <input type="reset" className="btn btn-secondary" value="Cancel"
                                       onClick={(event) => this.backSubmit(event)}/>
                                <input type="button" className="btn btn-primary ms-2" value="Send"
                                       onClick={(event) => this.handleSubmit(event)}/>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

export default withParams(FeedbackForm)
