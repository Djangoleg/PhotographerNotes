import React from 'react';
import withParams from "./ComponentWithParams";
import axios from "axios";
import url from "./AppURL";
import $ from "jquery";
import appPath from "./AppPath";

class EmailVerification extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            activation_key: ''
        }
    }

    componentDidMount() {
        let username = this.props.params.username;
        let activation_key = this.props.params.activation_key;
        this.setState(
            {
                username: username,
                activation_key: activation_key
            }
        );
    }

    verification() {
        $('#reg_message').html('');

        if (this.state.username && this.state.activation_key) {

            let verUrl = `${url.get()}/verify/${this.state.username}/${this.state.activation_key}/`;

            axios.get(verUrl)
                .then(response => {
                    if (response.data) {
                        if (response.data.status !== 'ok') {
                            $('#reg_message').html('Email verification failed').removeClass('text-success').addClass('text-danger');
                            console.log(response.data.description);
                        } else {
                            $('#reg_message').html('Email verification successful').removeClass('text-danger').addClass('text-success');
                            $('#verification_btn').prop('disabled', true);
                            setInterval(() => {
                                this.props.navigate(appPath.login);
                            }, 1000);
                        }
                    }
                }).catch(error => {
                $('#reg_message').html('Email verification failed').removeClass('text-success').addClass('text-danger');
                console.log(error);
            });
        }
    }

    render() {
        return (
            <div>
                <main>
                    <section className="section">
                        <div className="container">
                            <div className="col-lg-12 text-center mb-5">
                                <h2>Email Verification</h2>
                            </div>
                            <div className="col-12 mb-5 d-flex justify-content-center">
                                <input id="verification_btn"
                                       type="button"
                                       className="btn btn-primary"
                                       value="Verification"
                                       onClick={() => this.verification()}/>
                            </div>
                            <div className="col-lg-12 text-center">
                                <div id="reg_message"></div>
                            </div>
                        </div>
                    </section>
                </main>
            </div>

        )
    }
}

export default withParams(EmailVerification)
