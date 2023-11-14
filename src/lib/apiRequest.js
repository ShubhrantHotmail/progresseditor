import axios from "axios";
import { Button } from "antd";

const instance = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

async function Request(props) {
  const request = {
    url: "",
    headers: {
      "Content-Type": "*/*",
    },
    data: null,
  };
  const controller = new AbortController();

  const handleCancel = () => {
    controller.abort();
  };
  const Cancel = () => {
    return (
      <>
        <p>Request in progress.....</p>
        <Button onClick={() => handleCancel()}>Cancel Request</Button>
      </>
    );
  };

  if (props?.dispatch) {
    props?.dispatch({ spin: true, tip: <Cancel /> });
  }

  request.method = props?.method ?? "get";
  request.url = props?.url;
  request.data = props?.data;
  request.headers = props?.headers;

  // console.log(request);
  const connect = async () => {
    try {
      if (request.method === "post") {
        const response = await instance.post(
          request.url,
          request.data,
          { headers: request.headers },
          {
            signal: controller.signal,
          },
          {
            onUploadProgress: function (progressEvent) {
              console.log(progressEvent);
            },
          },
          {
            onDownloadProgress: function (progressEvent) {
              console.log(progressEvent);
            },
          }
        );
        if (props?.dispatch) props?.dispatch({ spin: false });
        return response.data;
      } else if (request.method === "get") {
        const response = await instance.get(
          request.url,
          { headers: request.headers },
          {
            signal: controller.signal,
          },
          {
            onUploadProgress: function (progressEvent) {
              console.log(progressEvent);
            },
          },
          {
            onDownloadProgress: function (progressEvent) {
              console.log(progressEvent);
            },
          }
        );
        if (props?.dispatch) props?.dispatch({ spin: false });
        return response.data;
      }
    } catch (error) {
      if (props?.dispatch) props?.dispatch({ spin: false });
      return { type: "error", message: error.message };
    }
  };
  let data = await connect();
  // console.log(data);
  if (
    typeof data === "string" &&
    data.indexOf("<!-- Generated by Webspeed: http://www.webspeed.com/ -->") >
      -1
  )
    data = {
      type: "error",
      message: `Server error returned with: \n\n${data}`,
    };
  return data;
}

async function login(params) {
  if (!params) {
    throw Error(
      "login function required userid and password wrapped in an object {uid:<ID>,pass:<password>}"
    );
  }
  if (!params.uid || params.uid === null || params.uid === "") {
    return { type: "error", message: "Userid is missing" };
  }
  if (!params.pass || params.pass === null || params.pass === "") {
    return { type: "error", message: "Password is missing" };
  }

  const data = {
    credApp: "CONNECT",
    credId: params.uid,
    credPwd: params.pass,
    credType: params.type,
  };

  const base64Data = btoa(JSON.stringify(data));
  const result = await axios

    .post("http://tisdev/tiscode/cgi/tiscode.sh/onetis/auth/api/weblogin", {
      authToken: base64Data,
    })
    .then((response) => {
      // console.log(response.data);
      return response.data;
    })
    .catch((error) => {
      // console.log(error);
      return error;
    });

  return result;
}

export { Request, login };
