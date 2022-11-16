import React from 'react';
import {useParams} from "react-router-dom";
import verify from './Verification';

const VerifyPage = () => {

    let {username, email, activation_key} = useParams();

    verify.email(username, email, activation_key);

    return (
            <div>
                <h3>username: {username}</h3>
                <h3>email: {email}</h3>
                <h3>activation_key: {activation_key}</h3>
            </div>
        );
}

export default VerifyPage;