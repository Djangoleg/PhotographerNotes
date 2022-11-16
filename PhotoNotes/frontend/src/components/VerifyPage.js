import React from 'react';
import {useParams} from "react-router-dom";
import verify from './Verification';

const VerifyPage = () => {

    let {username, email, activation_key} = useParams();

    verify.email(username, email, activation_key);

    return (
            <div id="reg_message"></div>
        );
}

export default VerifyPage;