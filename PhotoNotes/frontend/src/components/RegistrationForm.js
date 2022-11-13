import React from 'react';
import $ from 'jquery';
import appPath from "./AppPath";


class RegistrationForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            'username': '',
            'email': '',
            'password': '',
            'confirmpassword': ''
        }
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
        const confirm_password = $('#confirm_password').val();

        if (!password || !confirm_password) {
            $('#confirm_password_message').html('Not Matching!').css('color', '#ff606e');
            return false;
        }

        if (password === confirm_password) {
            $('#confirm_password_message').html('Matching!').css('color', '#2acc80');
            return true;
        } else {
            $('#confirm_password_message').html('Not Matching!').css('color', '#ff606e');
            return false;
        }
    }

    handleSubmit(event) {
        let forms = document.querySelectorAll('.requires-validation');
        if (forms) {
            if (forms.length > 0) {
                const form = forms[0];
                if (this.checkPassword()) {
                    if (form.checkValidity()) {
                        this.props.redData(this.state.username, this.state.password, this.state.email);
                        event.preventDefault();
                        event.stopPropagation();
                        $('#reg_message').html(`${this.state.username}, ${this.state.password}, ${this.state.email}`).css('color', '#ff606e');
                    } else {
                        event.preventDefault();
                        event.stopPropagation();
                        form.classList.add('was-validated');
                    }
                } else {
                    event.preventDefault();
                    event.stopPropagation();
                    form.classList.add('was-validated');
                }
            }
        }
    }

    render() {
        return (
            <div className="form-body">
                <div className="row">
                    <div className="form-holder">
                        <div className="form-content">
                            <div className="form-items">
                                <h3>Registration</h3>
                                <p>Fill in the data below.</p>
                                <form className="requires-validation" noValidate
                                      onSubmit={(event) => this.handleSubmit(event)}>

                                    <div className="col-md-12">
                                        <input className="form-control" type="username" name="username"
                                               placeholder="Username" required value={this.state.username}
                                               onChange={(event) => this.handleChange(event)}/>
                                        <div className="valid-feedback">Username field is valid!</div>
                                        <div className="invalid-feedback">Username field cannot be blank!</div>
                                    </div>

                                    <div className="col-md-12">
                                        <input className="form-control" type="email" name="email"
                                               placeholder="Email" required value={this.state.email}
                                               onChange={(event) => this.handleChange(event)}/>
                                        <div className="valid-feedback">Email field is valid!</div>
                                        <div className="invalid-feedback">Email field cannot be blank!</div>
                                    </div>

                                    <div className="col-md-12">
                                        <input id="password" className="form-control" type="password" name="password"
                                               placeholder="Password" required value={this.state.password}
                                               onChange={(event) => this.handleChange(event)}/>
                                        <div className="valid-feedback">Password field is valid!</div>
                                        <div className="invalid-feedback">Password field cannot be blank!</div>
                                    </div>

                                    <div className="col-md-12">
                                        <input id="confirm_password" className="form-control" type="password"
                                               name="confirmpassword"
                                               placeholder="Confirm password" required
                                               value={this.state.confirmpassword}
                                               onChange={(event) => this.handleChange(event)}/>
                                        <div className="valid-feedback">Confirm password field is valid!</div>
                                        <div className="invalid-feedback">Confirm password field cannot be blank!</div>
                                    </div>

                                    <div id="confirm_password_message"></div>

                                    <div className="form-button mt-3">
                                        <button type="submit" className="btn btn-primary">Registration</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="reg-message" id="reg_message"></div>
                    </div>
                </div>
            </div>
        );
    }
}

export default RegistrationForm
