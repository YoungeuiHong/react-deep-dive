import axios from "axios";
import axiosRetry from "axios-retry";

const OPENVIDU_URL =
  process.env.NODE_ENV === "production"
    ? "https://demos.openvidu.io"
    : "http://localhost:4443";

const OPENVIDU_SECRET =
  process.env.NODE_ENV === "production" ? "MY_SECRET" : "MY_SECRET";

export const openViduApi = axios.create({
  baseURL: OPENVIDU_URL,
  headers: {
    Authorization: "Basic " + btoa(`OPENVIDUAPP:${OPENVIDU_SECRET}`),
    "Content-Type": "application/json",
  },
});

axiosRetry(openViduApi, { retries: 3 });
