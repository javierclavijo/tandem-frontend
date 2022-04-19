/** @jsxImportSource @emotion/react */

import React from "react";
import {Channel} from "../../entities/Channel";
import {css} from "@emotion/react";
import EditButton from "./EditButton";

interface DescriptionProps {
    data: Channel | undefined;
    editable: boolean;
}

function Description({data, editable}: DescriptionProps) {

    const [editEnabled, setEditEnabled] = React.useState<boolean>(false);

    return editable ?
        <React.Fragment>
            <div css={css`
              display: flex;
              align-items: center;
              gap: 1rem;
            `}>
                <h3>Description</h3>
                {editEnabled ?
                    <React.Fragment>
                        <EditButton type="accept" onClickFn={() => setEditEnabled(false)}/>
                        <EditButton type="cancel" onClickFn={() => setEditEnabled(false)}/>
                    </React.Fragment> :
                    <EditButton type="enable" onClickFn={() => setEditEnabled(true)}/>
                }
            </div>
            <input type={"text"} disabled={!editEnabled}/>
        </React.Fragment> :
        <React.Fragment>
            <h3>Description</h3>
            <p>{data?.description}</p>
        </React.Fragment>
        ;
}

export default Description;