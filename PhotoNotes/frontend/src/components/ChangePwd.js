import React from "react";
import {useNavigate, useParams} from "react-router-dom";
import Auth from "./Authentication";
import axios from "axios";
import url from "./AppURL";
import $ from "jquery";

const Authentication = Auth;
Authentication.getTokenFromStorage();

const withParams = (Component) => {
    return props => <Component {...props} params={useParams()} navigate={useNavigate()}/>;
}

class ChangePwd extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            password: '',
            confirmpassword: '',
            confirmPasswordMessage: '',
            keyIsValid: false
        }
    }

    componentDidMount() {
        const key = this.props.params.key;
        if (!key) {
            return;
        }
        Authentication.setToken('', '', '', '');
        const checkUrl = `${url.get()}/checkkey/${key}/`
        axios.get(checkUrl)
            .then(response => {
                const respData = response.data;
                if (!respData['message']) {
                    if (respData['token'] && respData['username'] && respData['profile_id'] && respData['firstname']) {
                        Authentication.setToken(respData['token'], respData['username'], respData['profile_id'], respData['firstname']);
                        this.setState({
                            keyIsValid: true
                        });
                    } else {
                        this.setState({
                            keyIsValid: false
                        });
                    }
                } else {
                    console.error(respData['message']);
                }
            }).catch(error => alert('Wrong check key!'));
    }

    handleChange(event) {
        this.setState(
            {
                [event.target.name]: event.target.value
            }
        );
        this.checkPassword();
    }

    checkPassword() {

        const password = $('#password').val();
        const confirmpassword = $('#confirmpassword').val();

        if (!password || !confirmpassword) {
            $('#confirm_password_message').css('color', '#ff606e');
            this.state.confirmPasswordMessage = 'Not Matching!';
            return false;
        }

        if (password === confirmpassword) {
            $('#confirm_password_message').css('color', '#2acc80');
            this.state.confirmPasswordMessage = 'Matching!';
            return true;
        } else {
            $('#confirm_password_message').css('color', '#ff606e');
            this.state.confirmPasswordMessage = 'Not Matching!';
            return false;
        }
    }

    handleSubmit = (event) => {
        let forms = document.querySelectorAll('.requires-validation');
        if (forms) {
            if (forms.length > 0) {
                const form = forms[0];
                if (this.checkPassword()) {
                    if (form.checkValidity()) {

                        // TODO: send request.
                        console.log('TODO: send request.');

                    } else {
                        form.classList.add('was-validated');
                    }
                } else {
                    form.classList.add('was-validated');
                }
                event.preventDefault();
                event.stopPropagation();
            }
        }
    }

    render() {
        return (
            <div>
                <main>
                    <section className="section">
                        <div className="container">
                            <div className="col-lg-12 text-lg-center">
                                <h2>Change password</h2>
                            </div>
                            <div className="row no-gutters-lg justify-content-center">
                                <div className="col-lg-9 mb-lg-5">
                                    <div className="row">
                                        <div className="col-12 mb-4">
                                            {
                                                this.state.keyIsValid ?
                                                    (
                                                        <form className="requires-validation" role="form" noValidate>
                                                            <div className="form-group row">
                                                                <label
                                                                    className="col-lg-3 col-form-label form-control-label">Password</label>
                                                                <div className="col-lg-9">
                                                                    <input
                                                                        className="form-control placeholder-custom-color"
                                                                        id="password" name="password"
                                                                        type="password"
                                                                        placeholder="Password.."
                                                                        value={this.state.password || ''}
                                                                        onChange={(event) => this.handleChange(event)}
                                                                        required/>
                                                                    <div className="valid-feedback">Password field is
                                                                        valid!
                                                                    </div>
                                                                    <div className="invalid-feedback">Password field
                                                                        cannot be blank!
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <br/>
                                                            <div className="form-group row">
                                                                <label
                                                                    className="col-lg-3 col-form-label form-control-label">Confirm
                                                                    password</label>
                                                                <div className="col-lg-9">
                                                                    <input className="form-control"
                                                                           id="confirmpassword"
                                                                           name="confirmpassword"
                                                                           type="password"
                                                                           placeholder="Confirm password.."
                                                                           value={this.state.confirmpassword || ''}
                                                                           onChange={(event) => this.handleChange(event)}
                                                                           required/>
                                                                    <div className="valid-feedback">Confirm password
                                                                        field is
                                                                        valid!
                                                                    </div>
                                                                    <div className="invalid-feedback">Confirm password
                                                                        field
                                                                        cannot
                                                                        be blank!
                                                                    </div>
                                                                    <div
                                                                        id="confirm_password_message">{this.state.confirmPasswordMessage}</div>
                                                                </div>
                                                            </div>
                                                            <br/>
                                                            <div className="form-group row">
                                                                <label
                                                                    className="col-lg-3 col-form-label form-control-label"></label>
                                                                <div className="col-lg-9">
                                                                    <input type="button"
                                                                           className="btn btn-primary ms-2"
                                                                           value="Save Changes"
                                                                           onClick={(event) => this.handleSubmit(event)}/>
                                                                </div>
                                                            </div>
                                                        </form>
                                                    ) :
                                                    (
                                                        <div className="col-lg-12 text-lg-center">Wrong check
                                                            key...</div>
                                                    )
                                            }
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

export default withParams(ChangePwd)
