import axios from "axios";
import $ from "jquery";
import url from "./AppURL"

const reg = {
    sendRegData: function (username, password, email, firstname, lastname) {
        axios.post(`${url.get()}/api/users/`,
                {username: username, password: password, email: email, first_name: firstname, last_name: lastname})
        .then(response => {
            if (response.data) {
                $('#reg_message').html(`Registration confirmation sent to email: ${response.data.email}`).css('color', '#ff606e');
                $('#reg_form_btn').prop('disabled', true);
            }
        }).catch(error => alert('User creation error'));
    }
}
export default reg
