import {Link} from "react-router-dom";

function BackButton() {
    return (
        // @ts-ignore
        <Link to={-1}>
            Back
        </Link>
    );
}

export default BackButton;
