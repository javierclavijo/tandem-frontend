/** @jsxImportSource @emotion/react */

import React from "react";
import {css} from "@emotion/react";
import {colors} from "../../styles/variables";
import {FlagIcon} from "react-flag-kit";
import {flagCodes} from "../../resources/languages";
import {NavArrowRight} from "iconoir-react";
import {Link} from "react-router-dom";

const defaultImg = require("../../static/images/user_placeholder.png");

interface SearchElementProps {
    id: string;
    name: string;
    languages: string[];
    description: string;
    image?: string | null;
    link: string;
}

function SearchResultElement(props: SearchElementProps) {
    return (
        <article css={css`
          display: grid;
          grid-template-columns: 1fr;
          grid-template-rows: 1fr;
          grid-template-areas: 'element';

          width: 100%;
          padding: 0.5rem 1rem;
          box-sizing: border-box;

          &:hover {
            background-color: ${colors.LIGHT};
          }
        `}>
            <div css={css`
              grid-area: element;
              display: flex;
              flex-direction: row;
              gap: 1rem;
            `}>
                <div css={css`
                  height: 4.5rem;
                  width: 4.5rem;
                  overflow: hidden;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  flex: 0 0 auto;
                `}>
                    <img src={props.image ?? defaultImg} alt=""
                         css={css`
                           height: 100%;
                           width: 100%;
                           object-fit: cover;
                         `}
                    />
                </div>
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
                    `}>
                        <h4>{props.name}</h4>
                        <NavArrowRight color={colors.PRIMARY} width={"1.5rem"} height={"1.5rem"}/>
                    </div>
                    <div css={css`
                      display: flex;
                      gap: 0.5rem;
                    `}>
                        {props.languages.map(language =>
                            <FlagIcon code={flagCodes.find(x => x.key === language)?.value || "AD"} size={24}
                                      key={`${props.id}-${language}`}/>)}
                    </div>
                    <p css={css`
                      text-overflow: ellipsis;
                      overflow: hidden;
                      white-space: nowrap;
                      max-width: 14rem;
                    `}>
                        {props.description}
                    </p>
                </div>
            </div>
            <Link to={props.link} css={css`
              grid-area: element;
              z-index: 10;
            `}/>
        </article>
    );
}

export default SearchResultElement;
