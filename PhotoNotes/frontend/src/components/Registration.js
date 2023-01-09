import axios from "axios";
import $ from "jquery";
import url from "./AppURL"

const reg = {
    sendRegData: function (username, password, email, firstname, lastname) {
        $('#spinner-loading').removeClass('visually-hidden');
        axios.post(`${url.get()}/api/users/`,
            {username: username, password: password, email: email, first_name: firstname, last_name: lastname})
            .then(response => {
                if (response.data) {

                    if (response.data.is_forbidden) {
                        $('#reg_message').html(`${response.data.message}`).css('color', '#ff606e');
                    } else {
                        $('#reg_message').html(`Registration confirmation sent to email: ${response.data.email}`).css('color', '#ff606e');
                    }

                    $('#reg_form_btn').prop('disabled', true);

                    $('#spinner-loading').addClass('visually-hidden');
                }
            }).catch(error => {

            $('#spinner-loading').addClass('visually-hidden');

            let values = []
            let message = '';
            for (let key in error.response.data) {
                if (error.response.data.hasOwnProperty(key)) {
                    if (Array.isArray(error.response.data[key]) && error.response.data[key].length > 0) {
                        values.push(error.response.data[key][0])
                    } else {
                        values.push(error.response.data[key])
                    }
                }
            }
            if (values.length > 0) {
                message = values[0];
            }

             $('#reg_message').html(`${message || JSON.stringify(error.response.data)}`).css('color', '#ff606e');
        });
    }
}
export default reg
