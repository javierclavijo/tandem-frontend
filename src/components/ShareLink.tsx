import { useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { infoButton } from "../pages/chats/styles";

interface ShareLinkProps {
  link: string;
}

/**
 * Component which allows the user to copy a link on click, displaying a 'copied to clipboard' message which
 * clears itself after a short interval.
 */
function ShareLink({ link }: ShareLinkProps) {
  /**
   * Used to show a 'copied to clipboard' text whenever the user copies the link.
   */
  const [copied, setCopied] = useState<boolean>(false);

  /**
   *  Sets a timeout of 2 seconds to clear the 'copied to clipboard' message whenever the user copies the link.
   */
  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => setCopied(false), 2000);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [copied]);

  return (
    <CopyToClipboard text={link} onCopy={() => setCopied(true)}>
      <button type="button" css={infoButton}>
        {!copied ? "Share" : "Copied to clipboard"}
      </button>
    </CopyToClipboard>
  );
}

export default ShareLink;
