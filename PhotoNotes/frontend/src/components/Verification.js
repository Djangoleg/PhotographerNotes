import axios from "axios";
import $ from "jquery";
import appPath from "./AppPath";

const verify = {
    email: function (username, email, activation_key) {

        axios.get(`http://${window.location.hostname}:8080/verify/${username}/${email}/${activation_key}/`)
        .then(response => {
            if (response.data) {
                if (response.data.status !== 'ok') {
                    $('#reg_message').html('Email verification failed').css('color', '#ff606e');
                    console.log(response.data.description);
                } else {
                    $('#reg_message').html('Email verification successful').css('color', '#ff606e');
                }
            }
        }).catch(error => {
            $('#reg_message').html('Email verification failed').css('color', '#ff606e');
            console.log(error);
        });
    }
}

export default verify
