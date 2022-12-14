import {Component} from "react";

class BackButton extends Component {
    static contextTypes = {
        router: () => true, // replace with PropTypes.object if you use them
    }

    render() {
        return (
            <div className="d-inline-block">
                <button
                    type="submit"
                    className="btn btn-primary"
                    onClick={this.context.router.history.goBack}>
                    Back
                </button>
            </div>
        )
    }
}