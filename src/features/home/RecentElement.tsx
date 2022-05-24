/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { NavArrowRight } from "iconoir-react";
import React from "react";
import { Link } from "react-router-dom";
import {
  containerWithLink,
  thumbnailContainer,
  thumbnailImg,
} from "../../styles/components";
import { colors } from "../../styles/variables";
import ResponsiveEllipsis from "../../utils/ResponsiveEllipsis";

const defaultImg = require("../../static/images/user_placeholder.png");

interface SearchElementProps {
  id: string;
  name: string;
  latestMessage: string;
  image?: string | null;
  link: string;
}

function RecentElement(props: SearchElementProps) {
  return (
    <article css={outerContainer}>
      <div css={innerContainer}>
        <div css={imgContainer}>
          <img src={props.image ?? defaultImg} alt="" css={thumbnailImg} />
        </div>
        <div css={contentContainer}>
          <div css={upperInnerContainer}>
            <h4>{props.name}</h4>
            <NavArrowRight
              color={colors.PRIMARY}
              width={"1.5rem"}
              height={"1.5rem"}
            />
          </div>
          <ResponsiveEllipsis
            text={props.latestMessage}
            maxLine="2"
            ellipsis="…"
            trimRight
            basedOn="letters"
          />
        </div>
      </div>
      <Link to={props.link} css={link} />
    </article>
  );
}

const imgContainer = css`
  ${thumbnailContainer};
  height: 4.5rem;
  width: 4.5rem;
  flex: 0 0 auto;
`;

const outerContainer = css`
  ${containerWithLink};
  width: 100%;

  &:hover {
    background-color: ${colors.LIGHT};
  }
`;

const innerContainer = css`
  grid-area: element;
  display: flex;
  flex-direction: row;
  gap: 1rem;
  padding: 0.5rem;
  box-sizing: border-box;
`;

const contentContainer = css`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const upperInnerContainer = css`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const link = css`
  grid-area: element;
`;

export default RecentElement;
