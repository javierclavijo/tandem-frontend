/** @jsxImportSource @emotion/react */

import React from 'react';
import { css, SerializedStyles } from '@emotion/react';
import { textSizes } from '../styles/variables';

interface EditButtonProps {
  visible: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  css?: SerializedStyles;
  children: JSX.Element | (JSX.Element | string)[] | string;
}

const Button = React.forwardRef<HTMLButtonElement, EditButtonProps>((
  props: EditButtonProps,
  ref?,
) =>
/*
     * Edit button component which allows visibility toggling, click event handling and ref forwarding.
     */

  (
    <button
      ref={ref}
      onClick={props.onClick}
      css={css`${buttonWithoutBackgroundAndBorder};
                  ${props.css};
                  ${!props.visible
        ? 'display: none;' : ''
                  }
                `}
    >
      {props.children}
    </button>
  ));

export const buttonWithoutBackgroundAndBorder = css`
  border: none;
  background: none;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  gap: 0.5rem;
  font-size: ${textSizes.S};
`;

export default Button;
