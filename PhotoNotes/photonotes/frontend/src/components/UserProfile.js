import React from "react";
import Auth from "./Authentication";
import url from "./AppURL";
import axios from "axios";
import $ from "jquery";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import withParams from "./ComponentWithParams";

class UseProfile extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            image: null,
            selectedFile: null,
            firstname: '',
            lastname: '',
            username: '',
            edit: false
        }
    }

    handleChange = (event) => {
        let value = event.target.value;
        if (event.target.type === "checkbox") {
            value = event.target.checked;
        }
        this.setState(
            {
                [event.target.name]: value
            }
        );
    }

    onFileChange = (event) => {

        this.setState({selectedFile: event.target.files[0]});

        if (event.target.files[0]) {
            $(".file-upload").addClass('active');
            $("#noFile").text(event.target.files[0].name);
            let uploadedFile = URL.createObjectURL(event.target.files[0]);
            $("#note_image").attr("src", uploadedFile);
        } else {
            $(".file-upload").removeClass('active');
            $("#noFile").text("No file chosen...");
        }
    };

    handleSubmit = (event) => {

        $('#save-button').prop('disabled', true);
        $('#cancel-button').prop('disabled', true);
        $('#spinner-loading').removeClass('visually-hidden');

        if ($('#note_image').attr('src')) {
            $('#chooseFile').prop('required', false);
        } else {
            $('#chooseFile').prop('required', true);
        }

        let form = document.querySelectorAll('.requires-validation')[0];

        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }

        let profileId = this.props.params.id;

        let headers = Auth.getHeaders();

        let data = new FormData();
        data.append('firstname', this.state.firstname);
        data.append('lastname', this.state.lastname);
        if (this.state.selectedFile) {
            data.append('image', this.state.selectedFile);
        }
        data.append('info', this.state.info);

        let profileUrl = `${url.get()}/api/profile/${profileId}/`;
        axios.put(profileUrl,
            data,
            {
                headers: headers,
            }).then(response => {

            if (response.data) {
                this.setState({image: response.data.image});
            } else {
                if (this.state.selectedFile) {
                    this.setState({image: URL.createObjectURL(this.state.selectedFile)});
                }
            }
            $('#spinner-loading').addClass('visually-hidden');
            this.setState({edit: false});

        }).catch(error => {
            $('#spinner-loading').addClass('visually-hidden');
            $('#save-button').prop('disabled', false);
            $('#cancel-button').prop('disabled', false);
            console.log(error);
            alert('Error change profile!');
        });
    };

    cancelSubmit = (event) => {
        this.setState({edit: false});
    }

    backSubmit = (event) => {
        this.props.navigate(-1);
    }

    editProfile = () => {
        this.setState({edit: true});
    }

    componentDidMount() {

        let profileId = this.props.params.id;

        if (profileId) {

            let headers = Auth.getHeaders();
            let profileUrl = `${url.get()}/api/profile/?id=${profileId}`;
            axios.get(`${profileUrl}`, {
                headers: headers,
            }).then(response => {
                let profile = response.data;
                if (profile.length > 0) {
                    profile = profile[0];
                    this.setState(
                        {
                            image: profile.image,
                            firstname: profile.user.first_name,
                            lastname: profile.user.last_name,
                            info: profile.info,
                            username: profile.user.username
                        }
                    )
                }
            }).catch(error => console.log(error))
        }
    }

    showEditButtons = () => {
        const auth = Auth;
        if (auth.username === this.state.username) {
            return true;
        }
        return false;
    }

    render() {
        return (
            <div>
                <main>
                    <section className="section">
                        <div className="container">
                            <div className="row no-gutters-lg justify-content-center">
                                <div className="col-lg-9 pb-5">
                                    <div className="row">
                                        <div className="col-12 mb-4">
                                            {this.state.edit ?
                                                (
                                                    <form className="requires-validation" noValidate>
                                                        <div className="form-group row">
                                                            <label
                                                                className="col-lg-3 col-form-label form-control-label">First
                                                                name</label>
                                                            <div className="col-lg-9">
                                                                <input className="form-control placeholder-custom-color"
                                                                       id="firstname" name="firstname"
                                                                       type="text"
                                                                       placeholder="Enter first name.."
                                                                       value={this.state.firstname || ''}
                                                                       onChange={(event) => this.handleChange(event)}
                                                                       required/>
                                                                <div className="valid-feedback">First name field is
                                                                    valid!
                                                                </div>
                                                                <div className="invalid-feedback">First name field
                                                                    cannot be blank!
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <br/>
                                                        <div className="form-group row">
                                                            <label
                                                                className="col-lg-3 col-form-label form-control-label">Last
                                                                name</label>
                                                            <div className="col-lg-9">
                                                                <input className="form-control" id="lastname"
                                                                       name="lastname"
                                                                       type="text"
                                                                       placeholder="Last name, please.."
                                                                       value={this.state.lastname || ''}
                                                                       onChange={(event) => this.handleChange(event)}
                                                                       required/>
                                                                <div className="valid-feedback">Last name field is
                                                                    valid!
                                                                </div>
                                                                <div className="invalid-feedback">Last name field cannot
                                                                    be blank!
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <br/>
                                                        <div className="form-group row">
                                                            <label
                                                                className="col-lg-3 col-form-label form-control-label">User
                                                                pic</label>
                                                            <div className="col-lg-9">
                                                                <div className="text-center mb30">
                                                                    <img id="note_image"
                                                                         className="rounded mx-auto d-block blog-img"
                                                                         src={(this.state.image || '/img/empty_user_pic.jpg')}
                                                                         alt=''/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <br/>
                                                        <div className="form-group row">
                                                            <label
                                                                className="col-lg-3 col-form-label form-control-label">Image
                                                                File</label>
                                                            <div className="col-lg-9">
                                                                <input id="chooseFile"
                                                                       className="form-control placeholder-custom-color"
                                                                       type="file"
                                                                       name="chooseFile"
                                                                       onChange={(event) => this.onFileChange(event)}/>
                                                                <div className="valid-feedback">File field is valid!
                                                                </div>
                                                                <div className="invalid-feedback">File field cannot be
                                                                    blank!
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <br/>
                                                        <div className="form-group row">
                                                            <label
                                                                className="col-lg-3 col-form-label form-control-label">Info</label>
                                                            <div className="col-lg-9">
                                                                <textarea className="form-control" id="info" name="info"
                                                                          rows="3"
                                                                          placeholder="Info, please.."
                                                                          value={this.state.info || ''}
                                                                          onChange={(event) => this.handleChange(event)}
                                                                          required/>
                                                                <div className="valid-feedback">Info field is valid!
                                                                </div>
                                                                <div className="invalid-feedback">Info field cannot be
                                                                    blank!
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <br/>
                                                        <div className="form-group row">
                                                            <label
                                                                className="col-lg-3 col-form-label form-control-label"></label>
                                                            <div className="col-lg-9">
                                                                <div className="text-center">
                                                                    <Spinner id="spinner-loading"
                                                                             className="visually-hidden"
                                                                             animation="border"
                                                                             variant="success"/>
                                                                </div>
                                                                <input id="cancel-button" type="reset"
                                                                       className="btn btn-secondary"
                                                                       value="Cancel"
                                                                       onClick={(event) => this.cancelSubmit(event)}/>
                                                                <input id="save-button" type="button"
                                                                       className="btn btn-primary ms-2"
                                                                       value="Save Changes"
                                                                       onClick={(event) => this.handleSubmit(event)}/>
                                                            </div>
                                                        </div>
                                                    </form>
                                                ) :
                                                (
                                                    <article className="card article-card">
                                                        <div className="col-lg-12 text-lg-center">
                                                            <h2 className="m-3 text-capitalize">
                                                                {this.state.firstname + ' ' + this.state.lastname || ''}
                                                            </h2>
                                                        </div>
                                                        <div className="card-image">
                                                            <img id="note_image"
                                                                 className="rounded mx-auto d-block blog-img"
                                                                 src={(this.state.image || '/img/empty_user_pic.jpg')}
                                                                 alt=''
                                                            />
                                                        </div>
                                                        <div className="card-body px-0 pb-1">
                                                            <p className="card-text m-3">{this.state.info || ''}</p>
                                                        </div>
                                                        <div className="d-inline-block">
                                                            <Button type="submit" className="btn btn-primary ms-1"
                                                                    onClick={this.backSubmit}>
                                                                Back
                                                            </Button>
                                                            {this.showEditButtons() ? (

                                                                <Button type="submit" className="btn btn-primary ms-1"
                                                                        onClick={this.editProfile}>
                                                                    Edit
                                                                </Button>

                                                            ) : null}
                                                        </div>
                                                    </article>
                                                )}
                                        < /div>
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

export default withParams(UseProfile)
