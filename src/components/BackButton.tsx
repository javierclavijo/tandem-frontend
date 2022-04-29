import {Link, To} from "react-router-dom";
import {ArrowLeft} from "iconoir-react";
import {colors} from "../styles/variables";

function BackButton({to}: { to?: To}) {
    return (
        // @ts-ignore
        <Link to={to ? to : -1}>
            <ArrowLeft color={colors.WHITE} width="1.5rem" height="1.5rem"/>
        </Link>
    );
}

export default BackButton;
