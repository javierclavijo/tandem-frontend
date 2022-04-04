import axios from "axios";

export type LogInRequestData = {
    username: string,
    password: string
}

export const loginRequest = async (data: LogInRequestData) => {
    const url = `${process.env.REACT_APP_API_URL as string}/api-token-auth/`;
    const response = await axios.post(url, data);
    return response.data.token;
};