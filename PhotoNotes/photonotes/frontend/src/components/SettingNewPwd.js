import React from "react";
import Auth from "./Authentication";
import axios from "axios";
import url from "./AppURL";
import $ from "jquery";
import appPath from "./AppPath";
import withParams from "./ComponentWithParams";
import {
    atLeastOneLowercase,
    atLeastOneNumeric,
    atLeastOneSpecialChar,
    atLeastOneUppercase,
    eightCharsOrMore,
    PASSWORDSTRENGTH
} from './CheckPwdConst'

const Authentication = Auth;
Authentication.getTokenFromStorage();

class SettingNewPwd extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            password: '',
            confirmpassword: '',
            confirmPasswordMessage: '',
            keyIsValid: false,
            pwdActionId: '',
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
                            keyIsValid: true,
                            pwdActionId: respData['id']
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

    setMeter = () => {
        this.setState(
            {
                meter: true
            }
        )
    }

    handleSubmit = (event) => {
        if (!this.state.meter) {
            this.setMeter();
        }
        let forms = document.querySelectorAll('.requires-validation');
        if (forms) {
            if (forms.length > 0) {
                const form = forms[0];
                if (this.checkPassword() && this.state.passwordStrength === PASSWORDSTRENGTH) {

                    form.classList.add('was-validated');

                    let headers = Authentication.getHeaders();
                    let data = new FormData();
                    data.append('password', this.state.password);

                    if (!this.state.pwdActionId) {
                        console.error(`Pwd action id is empty!`);
                        return;
                    }

                    let pwdUrl = `${url.get()}/api/pwdsetting/${this.state.pwdActionId}/`;
                    axios.put(pwdUrl,
                        data,
                        {
                            headers: headers,
                        }).then(response => {
                        Authentication.setToken('', '', '', '');
                        this.props.navigate(appPath.login);
                    }).catch(error => {
                        console.log(error);
                        alert('Error change password!');
                    });
                }
                event.preventDefault();
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
                                <h2>Set password</h2>
                            </div>
                            <div className="row no-gutters-lg justify-content-center">
                                <div className="col-lg-9 mb-lg-5">
                                    <div className="row">
                                        <div className="col-12 mb-4">
                                            {
                                                this.state.keyIsValid ?
                                                    (
                                                        <form className="requires-validation" noValidate>
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
                                                                        onChange={(event) => this.handlePasswordChange(event)}
                                                                        onFocus={() => this.setMeter()}
                                                                    />
                                                                    <div className="text-danger">
                                                                        {
                                                                            this.state.meter && (
                                                                                <div>
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
                                                                           onChange={(event) => this.handleConfirmPasswordChange(event)}
                                                                           onFocus={() => this.setMeter()}
                                                                    />
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
                                                        <div className="col-lg-12 text-lg-center text-danger">Wrong
                                                            hash
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

export default withParams(SettingNewPwd)
