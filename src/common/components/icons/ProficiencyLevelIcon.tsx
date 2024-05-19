import { Globe, ThreeStars } from "iconoir-react";
import React from "react";
import { ProficiencyLevel } from "../../types";
import Beginner from "./Beginner";
import Intermediate from "./Intermediate";

interface ProficiencyLevelIconProps extends React.SVGProps<SVGSVGElement> {
  level: ProficiencyLevel;
}

/**
 * Renders the appropriate proficiency level icon for the level passed in the component's props.
 */
const ProficiencyLevelIcon = (
  { level, ...props }: ProficiencyLevelIconProps,
  svgRef?: React.Ref<SVGSVGElement>,
) => {
  const Component = components[level];
  return <Component ref={svgRef} {...props} />;
};

const components: Record<
  ProficiencyLevel,
  React.FC<React.SVGProps<SVGSVGElement>>
> = {
  BE: Beginner,
  IN: Intermediate,
  AD: ThreeStars,
  NA: Globe,
};

export default React.forwardRef(ProficiencyLevelIcon);
