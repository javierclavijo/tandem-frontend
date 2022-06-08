import { Link, To } from "react-router-dom";
import { ArrowLeft } from "iconoir-react";
import { colors } from "../styles/variables";

/**
 * Back button component. The location it navigates to can be modified.
 * Defaults to -1 (go back to the previous location).
 */
function BackButton({ to }: { to?: To }) {
  return (
    // @ts-ignore
    <Link to={to ? to : -1}>
      <ArrowLeft color={colors.WHITE} width="1.5rem" height="1.5rem" />
    </Link>
  );
}

export default BackButton;
