/** @jsxImportSource @emotion/react */

import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { css } from '@emotion/react';
import { buttonWithoutBackgroundAndBorder } from './Button';
import { colors } from '../styles/variables';

interface ShareLinkProps {
  link: string;
}

function ShareLink(props: ShareLinkProps) {
  /**
     * Simple component which allows the user to copy a link on click, displaying a 'copied to clipboard' message which
     * clears itself after a short interval.
     */

  /**
     * Used to show a 'copied to clipboard' text whenever the user copies the link.
     */
  const [copied, setCopied] = React.useState<boolean>(false);

  /**
     *  Sets a timeout of 2 seconds to clear the 'copied to clipboard' message whenever the user copies the link.
     */
  React.useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => setCopied(false), 2000);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [copied]);

  return (
    <CopyToClipboard text={props.link} onCopy={() => setCopied(true)}>
      <button
        type="button"
        css={css`${buttonWithoutBackgroundAndBorder};
              color: ${colors.WHITE};
            `}
      >
        {!copied ? 'Share' : 'Copied to clipboard'}
      </button>
    </CopyToClipboard>
  );
}

export default ShareLink;
