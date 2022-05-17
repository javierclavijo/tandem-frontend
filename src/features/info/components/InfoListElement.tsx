/** @jsxImportSource @emotion/react */

import React from "react";
import { infoListElementInnerContainer, infoListElementImg } from "../styles";
import { css } from "@emotion/react";
import { NavArrowRight } from "iconoir-react";
import { colors } from "../../../styles/variables";
import { imageContainerCss } from "../../chats/styles";
import { Link } from "react-router-dom";

const defaultImg = require("../../../static/images/user_placeholder.png");

interface InfoListElementProps {
  name: string;
  additionalInfo?: string;
  description: string;
  image: string | null;
  link: string;
  buttons?: JSX.Element;
}

function InfoListElement(props: InfoListElementProps) {
  /**
   * List element for lists in channel and user info components. Admits a 'buttons' JSX prop which is made visible on
   * hover.
   */
  const [displayButtons, setDisplayButtons] = React.useState<boolean>(false);

  return (
    <article
      onMouseEnter={() => setDisplayButtons(true)}
      onMouseLeave={() => setDisplayButtons(false)}
      css={css`
        display: grid;
        grid-template-rows: 1fr;
        grid-template-columns: 1fr;
        grid-template-areas: "element";
        padding: 0.5rem 1rem;

        &:hover {
          background-color: ${colors.LIGHT};
        }
      `}
    >
      <div css={infoListElementInnerContainer}>
        <div css={imageContainerCss}>
          <img
            src={props.image ?? defaultImg}
            alt=""
            css={infoListElementImg}
          />
        </div>
        <div
          css={css`
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            width: 100%;
          `}
        >
          <div
            css={css`
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              align-items: center;
              height: 100%;
            `}
          >
            <span
              css={css`
                display: flex;
                gap: 1rem;
              `}
            >
              <h4>{props.name}</h4>
              {props.additionalInfo ? (
                <p
                  css={css`
                    color: ${colors.PRIMARY};
                  `}
                >
                  {props.additionalInfo}
                </p>
              ) : null}
            </span>
            <div
              css={css`
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 1rem;
              `}
            >
              <div
                css={css`
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  gap: 1rem;
                  z-index: 10;
                  visibility: ${displayButtons ? "visible" : "hidden"};
                `}
              >
                {props.buttons}
              </div>
              <NavArrowRight
                color={colors.PRIMARY}
                width={"1.5rem"}
                height={"1.5rem"}
              />
            </div>
          </div>
          <div
            css={css`
              height: 100%;
              display: flex;
              align-items: center;
            `}
          >
            <p
              css={css`
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
                max-width: 14rem;
              `}
            >
              {props.description}
            </p>
          </div>
        </div>
      </div>
      <Link
        to={props.link}
        css={css`
          grid-area: element;
          height: 100%;
          width: 100%;
          z-index: 5;
        `}
      />
    </article>
  );
}

export default InfoListElement;
