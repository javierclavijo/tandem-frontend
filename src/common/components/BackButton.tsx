import { ArrowLeft } from "iconoir-react";
import { Link, LinkProps, To, useNavigate } from "react-router-dom";
import { COLORS } from "../constants";

interface BackButtonProps
  extends Omit<LinkProps & React.RefAttributes<HTMLAnchorElement>, "to"> {
  to?: To;
}

/**
 * Back button component. The location it navigates to can be modified.
 * Defaults to going back to the previous location.
 */
function BackButton({ to, ...props }: BackButtonProps) {
  const navigate = useNavigate();

  const handleClick: React.MouseEventHandler<HTMLAnchorElement> = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => {
    props.onClick?.(event);
    event.preventDefault();
    navigate(-1);
  };

  return (
    <Link to={to ?? ".."} title="Go back" {...props} onClick={handleClick}>
      <ArrowLeft color={COLORS.WHITE} width="1.5rem" height="1.5rem" />
    </Link>
  );
}

export default BackButton;
