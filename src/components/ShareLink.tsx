import React from "react";
import {CopyToClipboard} from "react-copy-to-clipboard";

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
                let timeout = setTimeout(() => setCopied(false), 2000);
                return () => {
                    clearTimeout(timeout);
                };
            }
        }, [copied]
    );


    return (
        <CopyToClipboard text={props.link} onCopy={() => setCopied(true)}>
            <p>{!copied ? "Share" : "Copied to clipboard"}</p>
        </CopyToClipboard>
    );
}

export default ShareLink;