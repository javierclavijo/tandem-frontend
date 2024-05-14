import { css } from "@emotion/react";
import React from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { infoButton } from "../features/info/styles";

interface ShareLinkProps {
  link: string;
}

/**
 * Component which allows the user to copy a link on click, displaying a 'copied to clipboard' message which
 * clears itself after a short interval.
 */
function ShareLink(props: ShareLinkProps) {
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
      <button type="button" css={button}>
        {!copied ? "Share" : "Copied to clipboard"}
      </button>
    </CopyToClipboard>
  );
}

const button = css`
  ${infoButton};
`;

export default ShareLink;
