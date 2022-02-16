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

  /* axiosInstance.interceptors.response.use(response, (error) => {
    if (error.config && error.response?.status === 401) {
      return deleteAuth();
    }
    return Promise.reject(error);
  }); */

  return axiosInstance;
}
