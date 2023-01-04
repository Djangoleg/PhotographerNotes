import React from "react";
import isEmail from 'validator/lib/isEmail';
import $ from "jquery";
import Spinner from "react-bootstrap/Spinner";
import axios from "axios";
import url from "./AppURL";
import Auth from "./Authentication";
import {useNavigate, useParams} from "react-router-dom";

const withParams = (Component) => {
    return props => <Component {...props} params={useParams()} navigate={useNavigate()}/>;
}

class RecoveryPwd extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            checkEmailMessage: '',
            sendLetterMessage: ''
        }
    }

    backSubmit = (event) => {
        this.props.navigate(-1);
    }

    handleChange(event) {
        this.setState(
            {
                [event.target.name]: event.target.value
            }
        );
    }

    clearMessages() {
        this.setState(
            {
                checkEmailMessage: '',
                sendLetterMessage: ''
            }
        );
    }

    handleSubmit = (event) => {
        if (!isEmail(this.state.email)) {
            $('#check_email_message').removeClass('text-success').addClass('text-danger');
            this.setState(
                {
                    checkEmailMessage: 'Enter valid Email!'
                }
            );
            return;
        } else {
            $('#check_email_message').removeClass('text-danger').addClass('text-success');
            this.clearMessages();
        }
        $('#spinner-loading').removeClass('visually-hidden');

        let headers = Auth.getHeaders();

        let data = new FormData();
        data.append('email', this.state.email);

        const recPwdUrl = `${url.get()}/api/pwd/`;

        axios.post(recPwdUrl,
            data,
            {
                headers: headers,
            }).then(response => {
            const respData = response.data;
            if (respData && respData.message) {
                this.setState(
                    {
                        sendLetterMessage: respData.message
                    }
                );
            }
            $('#spinner-loading').addClass('visually-hidden');
        }).catch(error => {
            $('#spinner-loading').addClass('visually-hidden');

            let values = []
            let message = '';
            for (let key in error.response.data) {
                if (error.response.data.hasOwnProperty(key)) {
                    if (Array.isArray(error.response.data[key]) && error.response.data[key].length > 0) {
                        values.push(error.response.data[key][0])
                    } else {
                        values.push(error.response.data[key])
                    }
                }
            }
            if (values.length > 0) {
                message = values[0];
            }

            this.setState(
                {
                    sendLetterMessage: message || JSON.stringify(error.response.data)
                }
            );
        });
    }

    render() {
        return (
            <div>
                <main>
                    <section className="section">
                        <div className="container">
                            <div className="col-lg-12 text-lg-center">
                                <h2>Password recovery</h2>
                            </div>
                            <div className="row no-gutters-lg justify-content-center">
                                <div className="col-lg-9 mb-lg-5">
                                    <div className="row">
                                        <div className="col-12 mb-4">
                                            <form className="requires-validation" noValidate>
                                                <div className="form-group row">
                                                    <label
                                                        className="col-lg-3 col-form-label form-control-label">E-Mail</label>
                                                    <div className="col-lg-9">
                                                        <input
                                                            className="form-control placeholder-custom-color"
                                                            id="email" name="email"
                                                            type="text"
                                                            placeholder="Email.."
                                                            value={this.state.email || ''}
                                                            onChange={(event) => this.handleChange(event)}
                                                            onFocus={() => this.clearMessages()}
                                                        />
                                                        <div
                                                            id="check_email_message">{this.state.checkEmailMessage}</div>
                                                    </div>
                                                </div>
                                                <br/>
                                                <div className="text-center">
                                                    <Spinner id="spinner-loading" className="visually-hidden"
                                                             animation="border" variant="success"/>
                                                </div>
                                                <br/>
                                                <div className="form-group row">
                                                    <label
                                                        className="col-lg-3 col-form-label form-control-label"></label>
                                                    <div className="col-lg-9">
                                                        <input type="button" className="btn btn-primary ms-1"
                                                               value="Back"
                                                               onClick={() => this.backSubmit()}/>
                                                        <input type="button"
                                                               className="btn btn-primary ms-2"
                                                               value="Send letter"
                                                               onClick={() => this.handleSubmit()}/>
                                                    </div>
                                                </div>
                                                <div
                                                    className="col-lg-12 text-lg-start mt-4 text-danger">{this.state.sendLetterMessage}</div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        )
    }
}

export default withParams(RecoveryPwd)
