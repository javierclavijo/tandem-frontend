import { css } from "@emotion/react";
import { NavArrowRight } from "iconoir-react";
import { Link } from "react-router-dom";
import {
  containerWithLink,
  thumbnailContainer,
} from "../../../common/components/styles";
import { COLORS } from "../../../common/resources/style-variables";
import { infoListElementInnerContainer } from "../styles";

import { useState } from "react";
import ChatThumbnail from "../../../common/components/UserThumbnail";

interface InfoListElementProps {
  name: string;
  additionalInfo?: string;
  description: string;
  image: string | null;
  link: string;
  buttons?: JSX.Element;
}

/**
 * List element for lists in channel and user info components. Admits a 'buttons' JSX prop which is made visible on
 * hover.
 */
function InfoListElement(props: InfoListElementProps) {
  const [displayButtons, setDisplayButtons] = useState<boolean>(false);

  const buttonsInnerContainer = css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    z-index: 10;
    visibility: ${displayButtons ? "visible" : "hidden"};
  `;

  return (
    <li
      onMouseEnter={() => setDisplayButtons(true)}
      onMouseLeave={() => setDisplayButtons(false)}
      css={outerContainer}
    >
      <div css={infoListElementInnerContainer}>
        <div css={pictureContainer}>
          <ChatThumbnail src={props.image} />
        </div>
        <div css={contentContainer}>
          <div css={upperInnerContentContainer}>
            <span css={title}>
              <h4>{props.name}</h4>
              {props.additionalInfo ? (
                <p css={additionalInfoText}>{props.additionalInfo}</p>
              ) : null}
            </span>
            <div css={upperOuterContentContainer}>
              <div css={buttonsInnerContainer}>{props.buttons}</div>
              <NavArrowRight
                color={COLORS.PRIMARY}
                width={"1.5rem"}
                height={"1.5rem"}
              />
            </div>
          </div>
          <div css={descriptionContainer}>
            <p css={descriptionText}>{props.description}</p>
          </div>
        </div>
      </div>
      <Link to={props.link} css={link} title={props.name} />
    </li>
  );
}

const outerContainer = css`
  ${containerWithLink};
  padding: 0.5rem 1rem;

  transition: background-color 0.1s;
  &:hover {
    background-color: ${COLORS.LIGHT};
  }
`;

const title = css`
  display: flex;
  gap: 1rem;
`;

const link = css`
  grid-area: element;
  height: 100%;
  width: 100%;
  z-index: 5;
`;

const descriptionText = css`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  max-width: 14rem;
  overflow-wrap: anywhere;
`;

const descriptionContainer = css`
  height: 100%;
  display: flex;
  align-items: center;
`;

const upperOuterContentContainer = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
`;

const contentContainer = css`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
`;

const upperInnerContentContainer = css`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 100%;
`;

const pictureContainer = css`
  ${thumbnailContainer};
  flex: 0 0 auto;
`;

const additionalInfoText = css`
  color: ${COLORS.PRIMARY};
`;

export default InfoListElement;
