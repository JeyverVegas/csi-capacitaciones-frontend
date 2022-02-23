import * as axios from "axios";
import SystemInfo from "../util/SystemInfo";
import { getAuth } from "./auth";


const host = SystemInfo?.api;

export const createAxios = () => {

  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  const axiosInstance = axios.default.create({
    baseURL: host,
    headers
  });

  axiosInstance.interceptors.request.use(
    async (request) => {
      const authInfo = JSON.parse(`${getAuth()}`);

      if (authInfo?.token) {
        request.headers = {
          ...headers,
          Authorization: `Bearer ${authInfo?.token}`
        };
      }

      return request;
    },
    (error) => Promise.reject(error)
  );

  axiosInstance?.interceptors?.response?.use?.(handleResponse, handleResponseError);

  return axiosInstance;
}

const handleResponse = (response) => {
  console.log('Axios Respuesta', response);
  return response;
}

const handleResponseError = (error) => {
  console.log('Axios Error',  Object.keys(error));
  console.log('Axios Error',  error?.response);
  return Promise.reject(error);
}
