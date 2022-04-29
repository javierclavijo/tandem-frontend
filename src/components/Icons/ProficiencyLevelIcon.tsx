import React from "react";
import Beginner from "./Beginner";
import Intermediate from "./Intermediate";
import {Globe, ThreeStars} from "iconoir-react";

interface ProficiencyLevelIconProps extends React.SVGProps<SVGSVGElement> {
    level: string;
}

function ProficiencyLevelIcon({level, ...props}: ProficiencyLevelIconProps,
                              svgRef?: React.Ref<SVGSVGElement>) {

    return level === "BE" ?
        <Beginner {...props} ref={svgRef}/> :
        level === "IN" ?
            <Intermediate {...props} ref={svgRef}/> :
            level === "AD" ?
                <ThreeStars {...props} ref={svgRef}/> :
                level === "NA" ?
                    <Globe {...props} ref={svgRef}/> :
                    null;
}

export default React.forwardRef(ProficiencyLevelIcon);
