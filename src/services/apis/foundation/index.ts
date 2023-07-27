import { ElMessage } from "element-plus";
import { LoginApiRequest, LoginApiResponse } from "./types";
import { handlerPathParams } from "../../../utils/utils";
import config from "../../../config/index";

export const LoginApi = async (data: LoginApiRequest) =>
  new Promise<LoginApiResponse>((resolve, reject) => {
    fetch(`${config.foundationURL}/token`, {
      method: "POST",
      headers: {
        Authorization: "Basic NDUwYzZjMDNmYzQ0YzQzYjo3OWQ5MDJkYmZlM2Q3ODFm",
        "Content-type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: handlerPathParams(data),
    })
      .then(async (response) => {
        if (response.ok) {
          const data: LoginApiResponse = await response.json();
          resolve(data);
        } else {
          const data = await response.json();
          reject(data?.error_description ?? "");
        }
      })
      .catch((error) => {
        reject("");
        ElMessage({
          customClass: "login-error-message-box",
          offset: 36,
          message: error.toString(),
          type: "error",
        });
      });
  });
