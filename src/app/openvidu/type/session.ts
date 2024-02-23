import {
  Event,
  OpenVidu,
  Publisher,
  Session,
  SessionEventMap,
  StreamManager,
} from "openvidu-browser";

export type SessionEventHandler = {
  type: keyof SessionEventMap;
  handler: (event: Event) => void;
};
