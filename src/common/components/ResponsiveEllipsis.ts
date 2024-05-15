import LinesEllipsis from "react-lines-ellipsis";
import responsiveHOC from "react-lines-ellipsis/lib/responsiveHOC";

/**
 * Responsive text ellipsis component.
 * Source: https://www.npmjs.com/package/react-lines-ellipsis
 */
const ResponsiveEllipsis = responsiveHOC()(LinesEllipsis);

export default ResponsiveEllipsis;
