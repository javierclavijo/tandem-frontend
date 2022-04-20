/** @jsxImportSource @emotion/react */

import React, {useCallback} from "react";
import {Channel} from "../../entities/Channel";
import {css} from "@emotion/react";
import EditButton from "./EditButton";
import {colors, textSizes} from "../../styles/variables";
import TextareaAutosize from "react-textarea-autosize";
import useAuth from "../auth/AuthContext";

interface DescriptionProps {
    data: Channel | undefined;
}

function Description({data}: DescriptionProps) {
    const [editable, setEditable] = React.useState<boolean>(false);
    const [editEnabled, setEditEnabled] = React.useState<boolean>(false);
    const [inputValue, setInputValue] = React.useState<string>("");
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    const submitButtonRef = React.useRef<HTMLButtonElement>(null);
    const {user} = useAuth();

    React.useEffect(() => setEditable(
        !!data?.memberships.some(membership =>
            membership.user?.id === user?.id && membership.role === "Administrator"
        )), [data?.memberships, user]);

    const setInitialDataDescription = useCallback(() => {
        if (data?.description) {
            setInputValue(data.description);
        }
    }, [data?.description]);

    const handleSubmit = () => {
        setEditEnabled(false);
    };

    const handleBlur = (event: React.FocusEvent<HTMLTextAreaElement>) => {
        // If the submit button was clicked, submit the value. Else, cancel the editing.
        if (event?.relatedTarget === submitButtonRef?.current) {
            handleSubmit();
        } else {
            handleCancel();
        }
    };

    const handleCancel = () => {
        setInitialDataDescription();
        setEditEnabled(false);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        // If the Meta or Control key is pressed at the same time as the Enter key, submit the form. If the pressed key
        // is the Escape key, cancel the editing and blur the text area.
        if (event.metaKey || event.ctrlKey && event.code === "Enter") {
            handleSubmit();
            textareaRef.current?.blur();
        } else if (event.code === "Escape") {
            handleCancel();
            textareaRef.current?.blur();
        }
    };

    React.useEffect(setInitialDataDescription, [data?.description]);

    return editable ?
        <React.Fragment>
            <div css={css`
              display: flex;
              align-items: center;
              gap: 1rem;
              width: 100%;
              height: 1.5rem;
            `}>
                <h3>Description</h3>
                <React.Fragment>
                    <EditButton type="accept" visible={editEnabled} onClick={handleSubmit}
                                ref={submitButtonRef}/>
                    <EditButton type="cancel" visible={editEnabled} onClick={handleCancel}/>
                </React.Fragment>
            </div>
            <TextareaAutosize id="description" name="description" ref={textareaRef}
                              value={inputValue}
                              onChange={(e) => setInputValue(e.target.value)}
                              onFocus={() => setEditEnabled(true)}
                              onBlur={handleBlur}
                              onKeyDown={handleKeyDown}
                              minRows={1} maxRows={8}
                              css={textarea}/>
        </React.Fragment> :
        <React.Fragment>
            <h3>Description</h3>
            <p>{data?.description}</p>
        </React.Fragment>
        ;
}


const textarea = css`
  width: 100%;
  height: fit-content;
  font-size: ${textSizes.M};
  resize: none;
  background: none;
  color: ${colors.WHITE};
  border: none;

  // Add bottom border with 0 opacity to avoid resizing on focus
  border-bottom: 1px solid ${colors.PRIMARY}00;

  &:hover:not(:focus) {
    background: ${colors.WHITE}20;
    border-radius: 3px;
  }

  &:focus {
    outline: none;
    border-bottom: 1px solid ${colors.LIGHT};
  }
`;

export default Description;
