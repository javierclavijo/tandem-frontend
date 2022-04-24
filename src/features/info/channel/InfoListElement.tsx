/** @jsxImportSource @emotion/react */

import React from "react";
import {infoListElementArticle, infoListElementImg} from "./styles";
import {css} from "@emotion/react";
import {NavArrowDown} from "iconoir-react";
import {colors} from "../../../styles/variables";

const placeholderImg = require("../../../static/images/user_placeholder.png");


interface InfoListElementProps {
    name: string,
    additionalInfo?: string,
    description: string
}

function InfoListElement({name, additionalInfo, description}: InfoListElementProps) {
    return (
        <article css={infoListElementArticle}>
            <img src={placeholderImg} alt="" css={infoListElementImg}/>
            <div css={css`
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              width: 100%;
            `}>
                <div css={css`
                  display: flex;
                  flex-direction: row;
                  justify-content: space-between;
                  align-items: center;
                  height: 100%;
                `}>
                    <span css={css`
                      display: flex;
                      gap: 1rem;
                    `}>
                    <h4>{name}</h4>
                        {additionalInfo ?
                            <p css={css`
                              color: ${colors.PRIMARY};
                            `}>
                                {additionalInfo}
                            </p> :
                            null
                        }
                </span>
                    <NavArrowDown color={colors.PRIMARY} width={"1.5rem"} height={"1.5rem"}/>
                </div>
                <div css={css`
                  height: 100%;
                  display: flex;
                  align-items: center;
                `}>
                    <p css={css`
                      text-overflow: ellipsis;
                      overflow: hidden;
                      white-space: nowrap;
                      max-width: 14rem;
                    `}>
                        {description}
                    </p>
                </div>
            </div>
        </article>
    )
        ;
}

export default InfoListElement;
