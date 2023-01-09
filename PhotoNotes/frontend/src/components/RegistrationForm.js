import React from 'react';
import $ from 'jquery';
import {
    atLeastOneLowercase,
    atLeastOneNumeric,
    atLeastOneSpecialChar,
    atLeastOneUppercase,
    eightCharsOrMore,
    PASSWORDSTRENGTH
} from './CheckPwdConst'
import Spinner from "react-bootstrap/Spinner";


class RegistrationForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            email: '',
            password: '',
            firstname: '',
            lastname: '',
            confirmpassword: '',
            confirmPasswordMessage: '',
            meter: false,
            passwordTracker: '',
            passwordStrength: 0
        }
    }

    setPasswordMeter(password) {

        let passwordTracker = {
            uppercase: password.match(atLeastOneUppercase),
            lowercase: password.match(atLeastOneLowercase),
            number: password.match(atLeastOneNumeric),
            specialChar: password.match(atLeastOneSpecialChar),
            eightCharsOrGreater: password.match(eightCharsOrMore),
        };

        this.setState(
            {
                passwordTracker: passwordTracker,
                passwordStrength: Object.values(passwordTracker).filter(
                    (value) => value
                ).length
            }
        );
    }

    handlePasswordChange(event) {
        this.setState(
            {
                password: event.target.value
            }
        );
        this.setPasswordMeter(event.target.value);
        this.checkPassword();
    }

    handleConfirmPasswordChange(event) {
        this.setState(
            {
                confirmpassword: event.target.value
            }
        );
        this.checkPassword();
    }

    setMeter = () => {
        this.setState(
            {
                meter: true
            }
        )
    }

    handleChange(event) {
        this.setState(
            {
                [event.target.name]: event.target.value
            }
        );
    }

    checkPassword() {

        const password = $('#password').val();
        const confirmpassword = $('#confirmpassword').val();

        if (password && confirmpassword && password === confirmpassword) {
            $('#confirm_password_message').removeClass('text-danger').addClass('text-success');
            this.setState(
                {
                    confirmPasswordMessage: 'Matching!'
                }
            );
            return true;
        } else {
            $('#confirm_password_message').removeClass('text-success').addClass('text-danger');
            this.setState(
                {
                    confirmPasswordMessage: 'Not Matching!'
                }
            );
            return false;
        }
    }

    handleSubmit(event) {
        if (!this.state.meter) {
            this.setMeter();
        }
        let forms = document.querySelectorAll('.requires-validation');
        if (forms) {
            if (forms.length > 0) {
                const form = forms[0];
                if (this.checkPassword() && this.state.passwordStrength === PASSWORDSTRENGTH) {
                    if (form.checkValidity()) {
                        this.props.redData(this.state.username, this.state.password, this.state.email,
                            this.state.firstname, this.state.lastname);
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
                                        <input className="form-control" type="firstname" name="firstname"
                                               placeholder="Firstname" required value={this.state.firstname}
                                               onChange={(event) => this.handleChange(event)}/>
                                        <div className="valid-feedback">Firstname field is valid!</div>
                                        <div className="invalid-feedback">Firstname field cannot be blank!</div>
                                    </div>

                                    <div className="col-md-12">
                                        <input className="form-control" type="lastname" name="lastname"
                                               placeholder="Lastname" value={this.state.lastname}
                                               onChange={(event) => this.handleChange(event)}/>
                                        <div className="valid-feedback">Lastname field is valid!</div>
                                        <div className="invalid-feedback">Lastname field cannot be blank!</div>
                                    </div>

                                    <div className="col-md-12">
                                        <input className="form-control" type="email" name="email"
                                               placeholder="Email" required value={this.state.email}
                                               onChange={(event) => this.handleChange(event)}/>
                                        <div className="valid-feedback">Email field is valid!</div>
                                        <div className="invalid-feedback">Email field cannot be blank!</div>
                                    </div>

                                    <div className="col-md-12">
                                        <input id="password"
                                               className="form-control"
                                               type="password"
                                               name="password"
                                               placeholder="Password"
                                               value={this.state.password}
                                               onChange={(event) => this.handlePasswordChange(event)}
                                               onFocus={() => this.setMeter()}
                                               required
                                        />
                                        <div className="text-danger">
                                            {
                                                this.state.meter && (
                                                    <div id="password_message">
                                                        {this.state.passwordStrength < PASSWORDSTRENGTH && 'Must contain '}
                                                        {!this.state.passwordTracker.uppercase && 'uppercase, '}
                                                        {!this.state.passwordTracker.lowercase && 'lowercase, '}
                                                        {!this.state.passwordTracker.specialChar && 'special character, '}
                                                        {!this.state.passwordTracker.number && 'number, '}
                                                        {!this.state.passwordTracker.eightCharsOrGreater && 'eight characters or more'}
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </div>

                                    <div className="col-md-12">
                                        <input id="confirmpassword"
                                               className="form-control"
                                               type="password"
                                               name="confirmpassword"
                                               placeholder="Confirm password"
                                               value={this.state.confirmpassword}
                                               onChange={(event) => this.handleConfirmPasswordChange(event)}
                                               required
                                        />
                                    </div>

                                    <div
                                        id="confirm_password_message">{this.state.confirmPasswordMessage}</div>

                                    <div className="form-button mt-3">
                                        <button id="reg_form_btn" type="submit"
                                                className="btn btn-primary">Registration
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <Spinner id="spinner-loading" className="visually-hidden"
                                 animation="border" variant="success"/>
                        <div className="reg-message" id="reg_message"></div>
                    </div>
                </div>
            </div>
        );
    }
}

export default RegistrationForm
