/** @jsxImportSource @emotion/react */

import React from "react";
import {profileImg} from "../styles";
import {useMutation, useQueryClient} from "react-query";
import {axiosApi} from "../../auth/AuthContext";
import {css} from "@emotion/react";

interface ImageInputProps {
    image: string,
    defaultImage: string,
    url: string,
    invalidateQueryKey: string | unknown[]
}

function ImageInput({image, defaultImage, url, invalidateQueryKey}: ImageInputProps) {

    const queryClient = useQueryClient();
    const inputRef = React.useRef<HTMLInputElement | null>(null);

    const request = async (data: FormData) => {
        const response = await axiosApi.patch(url, data, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        return response.data;
    };

    const mutation = useMutation(request, {
        onSuccess: async () => {
            await queryClient.invalidateQueries(invalidateQueryKey);
        }
    });

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const data = new FormData();
            data.append("image", file);
            await mutation.mutateAsync(data);
        }
    };

    return (
        <div css={css`
          display: grid;
          grid-template-columns: 1fr;
          grid-template-rows: 1fr;
          grid-template-areas: "input";
          width: 12rem;
          height: 12rem;
        `}>
            <input type="file" name="image" id="image"
                   accept="image/jpeg,image/png,image/webp"
                   onChange={handleChange}
                   css={css`
                     grid-area: input;
                     opacity: 0;
                     z-index: 10;
                     width: 100%;
                     height: 100%;
                   `}
                   ref={inputRef}
            />
            <img src={image ?? defaultImage} alt="" css={css`${profileImg};
              grid-area: input;
            `}/>
        </div>
    );
}

export default ImageInput;
