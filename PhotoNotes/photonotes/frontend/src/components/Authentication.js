import axios from 'axios';
import Cookies from 'universal-cookie';
import url from "./AppURL"
import appPath from "./AppPath";
import {useNavigate} from "react-router-dom";

const Auth = {
    token: '',
    username: '',
    profile: '',
    firstname: '',
    user: '',
    login: function (username, password) {
        axios.post(`${url.get()}/api-token-auth/`, {username: username, password: password})
        .then(response => {

            this.setToken(response.data['token'], username, response.data['profile_id'],
                response.data['firstname'], response.data['user_id']);
            document.location.pathname = appPath.blog;

        }).catch(error => alert('Wrong login or password'));
    },
    logout: function () {
        this.setToken('', '', '', '', '');
        document.location.reload();
    },
    logoutWithRedirect: function (redirectUrl) {
        this.setToken('', '', '', '', '');
        document.location.pathname = redirectUrl;
    },
    setToken: function (token, username, profile, firstname, user) {
        const cookies = new Cookies();
        cookies.set('token', token, { path: '/' });
        cookies.set('username', username, { path: '/' });
        cookies.set('profile', profile, { path: '/' });
        cookies.set('firstname', firstname, { path: '/' });
        cookies.set('user', user, { path: '/' });
        this.token = token;
        this.username = username;
        this.profile = profile;
        this.firstname = firstname;
        this.user = user;
    },
    getTokenFromStorage: function () {
        const cookies = new Cookies();
        const token = cookies.get('token');
        const username = cookies.get('username');
        const profile = cookies.get('profile');
        const firstname = cookies.get('firstname');
        const user = cookies.get('user');
        this.token = token;
        this.username = username;
        this.profile = profile;
        this.firstname = firstname;
        this.user = user;
    },
    isAuthenticated: function () {
        return this.token !== '' && this.token !== undefined;
    },
    getHeaders: function () {
        let headers = {
            'Content-Type': 'application/json'
        }
        if (this.isAuthenticated()) {
            headers['Authorization'] = 'Token ' + this.token;
        }
        return headers;
    }
}

export default Auth


