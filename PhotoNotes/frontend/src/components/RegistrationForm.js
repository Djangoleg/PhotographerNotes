import React from 'react';
import appPath from "./AppPath";
import '../auth.css'

class RegistrationForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            'username': '',
            'email': '',
            'password': ''
        }
    }

    handleChange(event) {
        this.setState(
            {
                [event.target.name]: event.target.value
            }
        );
    }

    handleSubmit(event) {
        let forms = document.querySelectorAll('.requires-validation');
        if (forms) {
            if (forms.length > 0) {
                const form = forms[0];
                if (form.checkValidity()) {
                    this.props.authData(this.state.username, this.state.password);
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
                                <form className="requires-validation" noValidate onSubmit={(event) => this.handleSubmit(event)}>

                                    <div className="col-md-12">
                                        <input className="form-control" type="username" name="username"
                                               placeholder="Username" required value={this.state.username} onChange={(event) => this.handleChange(event)}/>
                                        <div className="valid-feedback">Username field is valid!</div>
                                        <div className="invalid-feedback">Username field cannot be blank!</div>
                                    </div>

                                    <div className="col-md-12">
                                        <input className="form-control" type="email" name="email"
                                               placeholder="Username" required value={this.state.username} onChange={(event) => this.handleChange(event)}/>
                                        <div className="valid-feedback">Email field is valid!</div>
                                        <div className="invalid-feedback">Email field cannot be blank!</div>
                                    </div>

                                    <div className="col-md-12">
                                        <input className="form-control" type="password" name="password"
                                               placeholder="Password" required value={this.state.password} onChange={(event) => this.handleChange(event)}/>
                                        <div className="valid-feedback">Password field is valid!</div>
                                        <div className="invalid-feedback">Password field cannot be blank!</div>
                                    </div>

                                    <div className="col-md-12">
                                        <input className="form-control" type="password" name="confirm-password"
                                               placeholder="Password" required value={this.state.password} onChange={(event) => this.handleChange(event)}/>
                                        <div className="valid-feedback">Password field is valid!</div>
                                        <div className="invalid-feedback">Password field cannot be blank!</div>
                                    </div>

                                    <div className="form-button mt-3">
                                        <button type="submit" className="btn btn-primary">Login</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default RegistrationForm
