import { css } from "@emotion/react";
import { ReactNode, forwardRef } from "react";
import { StyledEmotionComponentProps } from "../types";
import Tabs from "./Tabs";

interface LayoutProps
  extends React.ClassAttributes<HTMLDivElement>,
    React.ButtonHTMLAttributes<HTMLDivElement>,
    StyledEmotionComponentProps {
  children: ReactNode;
}

export const SimpleLayout = forwardRef<HTMLDivElement, LayoutProps>(
  ({ children, ...props }: LayoutProps, ref?) => (
    <div {...props} ref={ref} css={[baseLayout, simpleLayout, props.css]}>
      {children}
    </div>
  ),
);

export const ResponsiveBottomTabsLayout = forwardRef<
  HTMLDivElement,
  LayoutProps
>(({ children, ...props }: LayoutProps, ref?) => (
  <div
    {...props}
    ref={ref}
    css={[baseLayout, responsiveBottomTabsLayout, props.css]}
  >
    {children}
    <Tabs />
  </div>
));

export const baseLayout = css`
  width: 100vw;
  height: 100vh;
  display: grid;
  grid-template-columns: 1fr;
  max-width: 100%;
`;

export const simpleLayout = css`
  grid-template-rows: 5rem 1fr;
  grid-template-areas:
    "header"
    "main";
`;

export const responsiveBottomTabsLayout = css`
  // Main page layout with tabs
  grid-template-rows: 5rem 1fr 3rem;
  grid-template-areas:
    "header"
    "main"
    "tabs";

  @media (min-width: 1024px) {
    // Set "tabs" area height to zero in desktop layout
    grid-template-rows: 5rem 1fr 0;
    grid-template-areas:
      "header"
      "main";
  }
`;
