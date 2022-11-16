import axios from "axios";
import $ from "jquery";
import appPath from "./AppPath";

const verify = {
    email: function (username, email, activation_key) {

        axios.post(`http://${window.location.hostname}:8080/verify/${username}/${email}/${activation_key}/`)
        .then(response => {
            if (response.data) {
                if (response.data.status !== 'ok') {
                    console.log(response.data.description);
                    document.location.pathname = appPath.index;
                }
            }
        }).catch(error => alert('Error email verification'));
    }
}

export default verify
