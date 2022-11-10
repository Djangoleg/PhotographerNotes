import axios from 'axios';
import Cookies from 'universal-cookie';

const auth = {
    token: '',
    username: '',
    login: function (username, password) {

        axios.post(`http://${window.location.hostname}:8000/api-token-auth/`, {username: username, password: password})
        .then(response => {

            this.setToken(response.data['token'], username);

        }).catch(error => alert('Неверный логин или пароль'));
    },
    logout: function () {
        this.setToken('', '');
    },
    setToken: function (token, username) {
        const cookies = new Cookies();
        cookies.set('token', token);
        cookies.set('username', username);
        this.token = token;
        this.username = username;
    },
    getTokenFromStorage: function () {
        const cookies = new Cookies();
        const token = cookies.get('token');
        const username = cookies.get('username');
        this.token = token;
        this.username = username;
    },
    isAuthenticated: function () {
        return this.token !== '';
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

export default auth;

