import React from "react";
import appPath from "./AppPath";
import {useNavigate, useParams} from "react-router-dom";
import Auth from "./Authentication";
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
        this.props.navigate(-1);
    }

    handleSubmit = (event) => {

        let form = document.querySelectorAll('.requires-validation')[0];

        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }

        let headers = Auth.getHeaders();

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
            <div className="container mt-4 mb-4 pb-5">
                <div className="col-lg-12 text-lg-center">
                    <h2>Feedback</h2>
                </div>
                <div className="col-lg-12">
                    <form className="requires-validation" role="form" noValidate>
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
                                <textarea id="body"
                                          name="body"
                                          className="form-control"
                                          rows="8" placeholder="Enter message.."
                                          value={this.state.body}
                                          onChange={(event) => this.handleChange(event)}
                                          required/>
                                <div className="valid-feedback">Body field is valid!</div>
                                <div className="invalid-feedback">Body field cannot be blank!</div>
                            </div>
                        </div>
                        <br/>
                        <div className="form-group row pb-5">
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
