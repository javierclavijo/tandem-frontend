import { css } from "@emotion/react";
import React, { useRef, useState } from "react";
import ProfileImage from "../../../common/components/ProfileImage";
import { COLORS, FONT_SIZES } from "../../../common/constants";
import userPlaceholderImage from "../../../common/static/images/user-placeholder.png";
import { useUpdateImage } from "../queries";

interface ImageInputProps {
  image: string | null;
  url: string;
  invalidateQueryKey: string | unknown[];
}

/**
 * Displays the profile image for a user or channel and allows updating it.
 */
function ImageInput({ image, url, invalidateQueryKey }: ImageInputProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const mutation = useUpdateImage(url, invalidateQueryKey);

  // Controls the label's visibility. Is enabled on hover (:hover would not
  // work, as the label needs to be on top of the input for that, which prevents
  // image dropping from working).
  const [isLabelDisplayed, setIsLabelDisplayed] = useState<boolean>(false);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file != null) {
      const data = new FormData();
      data.append("image", file);
      await mutation.mutateAsync(data);
    }
  };

  return (
    <div
      onMouseEnter={() => setIsLabelDisplayed(true)}
      onMouseLeave={() => setIsLabelDisplayed(false)}
      css={container}
    >
      <input
        type="file"
        name="image"
        id="image"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleChange}
        css={input}
        ref={inputRef}
        aria-label="Update profile image"
      />
      <label
        htmlFor={"image"}
        css={label}
        style={{ opacity: isLabelDisplayed ? 1 : 0 }}
      >
        Click or drop a picture here...
      </label>
      <ProfileImage
        src={image ?? userPlaceholderImage}
        alt=""
        css={imageElement}
      />
    </div>
  );
}

const container = css`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  grid-template-areas: "input";
  width: 12rem;
  height: 12rem;
`;

const input = css`
  grid-area: input;
  opacity: 0;
  z-index: 10;
  width: 100%;
  height: 100%;
`;

const label = css`
  grid-area: input;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  z-index: 5;
  height: 100%;
  width: 100%;
  background-color: ${COLORS.LIGHT}80;
  border-radius: 50%;
  -webkit-text-stroke: 1px black;
  font-size: ${FONT_SIZES.L};
  backdrop-filter: blur(2px);
  transition: opacity 0.2s;
`;

const imageElement = css`
  grid-area: input;
`;

export default ImageInput;
