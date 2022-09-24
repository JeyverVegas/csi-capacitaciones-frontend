import * as axios from "axios";
import SystemInfo from "../util/SystemInfo";
import { deleteAuth, getAuth } from "./auth";
import { toast } from "react-toastify";


const host = SystemInfo?.api;

const defaultOpts = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
}

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
  return response;
}

const handleResponseError = (error) => {

  if (error?.response) {
    const errorInfo = error?.response;
    const { data, status } = errorInfo;
    if (status === 422) {
      handleValidationErrors(data);
    }

    if (status === 401) {
      handleUnAuthorizeUser(data);
    }

    if (status === 403) {
      if (data?.message === 'Your email address is not verified.') {
        window.location.pathname = '/email/no-verificado';
      } else {
        toast.error(`Error 403: No tienes permisos para este recurso.`, defaultOpts)
      }
    }

    if (status === 404) {
      toast.error(`Error 404: La ruta no existe en el servidor.`, defaultOpts)
    }

    if (status === 500) {
      toast.error(`Ha ocurrido un error en el servidor.`, defaultOpts);
    }
  }
  return Promise.reject(error);
}


const handleValidationErrors = (errorData) => {
  if (Object.keys(errorData?.errors).length > 0) {
    Object.keys(errorData?.errors).forEach((keyName, i) => {
      setTimeout(() => {
        toast.error(`Error: ${errorData?.errors?.[keyName]?.[0]}`, defaultOpts);
      }, Number(`${i}000`));
    });
  }
}

const handleUnAuthorizeUser = (data) => {
  if (data?.message === 'Unauthenticated.') {
    deleteAuth();
    window.location.pathname = '/iniciar-sesion';
  }
}
