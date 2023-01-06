import axios from 'axios';
import Cookies from 'universal-cookie';
import url from "./AppURL"
import appPath from "./AppPath";

const Auth = {
    token: '',
    username: '',
    profile: '',
    firstname: '',
    login: function (username, password) {
        axios.post(`${url.get()}/api-token-auth/`, {username: username, password: password})
        .then(response => {

            this.setToken(response.data['token'], username, response.data['profile_id'], response.data['firstname']);
            document.location.pathname = appPath.blog;

        }).catch(error => alert('Wrong login or password'));
    },
    logout: function () {
        this.setToken('', '', '', '');
        document.location.reload();
    },
    setToken: function (token, username, profile, firstname) {
        const cookies = new Cookies();
        cookies.set('token', token, { path: '/' });
        cookies.set('username', username, { path: '/' });
        cookies.set('profile', profile, { path: '/' });
        cookies.set('firstname', firstname, { path: '/' });
        this.token = token;
        this.username = username;
        this.profile = profile;
        this.firstname = firstname;
    },
    getTokenFromStorage: function () {
        const cookies = new Cookies();
        const token = cookies.get('token');
        const username = cookies.get('username');
        const profile = cookies.get('profile');
        const firstname = cookies.get('firstname');
        this.token = token;
        this.username = username;
        this.profile = profile;
        this.firstname = firstname;
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


