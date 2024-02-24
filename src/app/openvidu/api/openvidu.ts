import type { SessionEventMap } from "openvidu-browser";
import {
  OpenVidu,
  Publisher,
  PublisherProperties,
  Session,
} from "openvidu-browser";
import type { SessionEventHandler } from "@/app/openvidu/type";
import { createOpenViduConnection } from "@/app/openvidu/api/connection";
import { createOpenViduSession } from "@/app/openvidu/api/session";

/**
 * 세션 생성 및 연결
 * @param sessionId
 * @param ov
 * @param session
 * @param eventHandlers
 * @param clientData
 * @param publisherProperties
 */
interface Params {
  sessionId: string;
  ov: OpenVidu;
  session: Session;
  eventHandlers?: SessionEventHandler<keyof SessionEventMap>[];
  clientData?: any;
  publisherProperties?: PublisherProperties;
}

export async function joinSession({
  sessionId,
  ov,
  session,
  eventHandlers,
  clientData,
  publisherProperties,
}: Params) {
  try {
    await createOpenViduSession(sessionId);
    await registerSessionEventHanlder(session, eventHandlers);
    const { token } = await createOpenViduConnection(sessionId);
    await connectToSession({ session, token, clientData });
    const publisher = await initPublisher({ ov, session, publisherProperties });
    return publisher;
  } catch (error) {
    return undefined;
  }
}

/**
 * 세션 이벤트 핸들러 등록
 * @param session
 * @param eventHandlers
 */
async function registerSessionEventHanlder(
  session: Session,
  eventHandlers?: SessionEventHandler<keyof SessionEventMap>[],
): Promise<void> {
  eventHandlers?.forEach((eventHandler) => {
    session.on(eventHandler.type, eventHandler.handler);
  });
}

/**
 * 세션 연결
 * @param session
 * @param token
 * @param clientData
 */
async function connectToSession({
  session,
  token,
  clientData,
}: {
  session: Session;
  token: string;
  clientData?: any;
}): Promise<void> {
  try {
    await session?.connect(token, {
      clientData:
        typeof clientData === "string"
          ? clientData
          : JSON.stringify(clientData),
    });
  } catch (error) {
    throw error;
  }
}

/**
 * Publisher 생성 및 배포
 * @param ov
 * @param session
 * @param publisherProperties
 */
async function initPublisher({
  ov,
  session,
  publisherProperties,
}: {
  ov: OpenVidu;
  session: Session;
  publisherProperties?: PublisherProperties;
}): Promise<Publisher> {
  try {
    await ov.getUserMedia({
      audioSource: undefined,
      videoSource: undefined,
    });

    const devices = await ov.getDevices();
    const videoDevices = devices?.filter(
      (device) => device.kind === "videoinput",
    );

    if (!videoDevices || videoDevices.length === 0) {
      throw new Error("No video devices found.");
    }

    const properties = publisherProperties ?? {
      audioSource: undefined,
      videoSource: videoDevices[0].deviceId,
      publishAudio: true,
      publishVideo: true,
      resolution: "640x480",
      frameRate: 30,
      insertMode: "APPEND",
      mirror: false,
    };

    const newPublisher = await ov.initPublisherAsync(undefined, properties);
    session.publish(newPublisher);
    return newPublisher;
  } catch (error) {
    throw error;
  }
}
