import {
  Event,
  OpenVidu,
  Publisher,
  Session,
  SessionEventMap,
  StreamManager,
} from "openvidu-browser";

export type SessionEventHandler<K extends keyof SessionEventMap> = {
  type: K;
  handler: (event: SessionEventMap[K]) => void;
};
