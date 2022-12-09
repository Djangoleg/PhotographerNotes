import axios from 'axios';
import Cookies from 'universal-cookie';
import appPath from "./AppPath";
import url from "./AppURL"
import React from "react";
import Constants from "./AppConstants";

const Auth = {
    token: '',
    username: '',
    login: function (username, password) {
        axios.post(`${url.get()}/api-token-auth/`, {username: username, password: password})
        .then(response => {

            this.setToken(response.data['token'], username);
            document.location.pathname = `/blog/${Constants.allTags}/${Constants.firstPage}`;

        }).catch(error => alert('Wrong login or password'));
    },
    logout: function () {
        this.setToken('', '');
        document.location.reload();
    },
    setToken: function (token, username) {
        const cookies = new Cookies();
        cookies.set('token', token, { path: '/' });
        cookies.set('username', username, { path: '/' });
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


