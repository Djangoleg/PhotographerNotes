import {useNavigate, useParams} from "react-router-dom";
import React from "react";

const withParams = (Component) => {
    return props => <Component {...props} params={useParams()} navigate={useNavigate()}/>;
}

export default withParams;
