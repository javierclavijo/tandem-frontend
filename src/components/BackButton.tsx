import { ArrowLeft } from "iconoir-react";
import { Link, To } from "react-router-dom";
import { COLORS } from "../resources/style-variables";

/**
 * Back button component. The location it navigates to can be modified.
 * Defaults to -1 (go back to the previous location).
 */
function BackButton({ to }: { to?: To }) {
  return (
    <Link to={to ? to : -1} title="Go back">
      <ArrowLeft color={COLORS.WHITE} width="1.5rem" height="1.5rem" />
    </Link>
  );
}

export default BackButton;
