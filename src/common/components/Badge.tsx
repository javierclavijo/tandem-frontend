import { css } from "@emotion/react";
import { PropsWithChildren, forwardRef } from "react";
import { StyledEmotionComponentProps } from "../types";

interface BadgeProps
  extends PropsWithChildren<React.ClassAttributes<HTMLDivElement>>,
    React.ButtonHTMLAttributes<HTMLDivElement>,
    StyledEmotionComponentProps {}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ children, ...props }: BadgeProps, ref?) => (
    <div {...props} ref={ref} css={[div, props.css]}>
      {children}
    </div>
  ),
);

const div = css`
  display: flex;
  border-radius: 5px;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.5rem;
  width: fit-content;
  height: 2rem;
`;

Badge.displayName = "Badge";

export default Badge;
