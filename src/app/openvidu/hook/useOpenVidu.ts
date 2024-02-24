import { Dispatch, SetStateAction, useEffect, useState } from "react";
import type { SessionEventMap } from "openvidu-browser";
import {
  OpenVidu,
  Publisher,
  PublisherProperties,
  Session,
  Stream,
  StreamManager,
} from "openvidu-browser";
import { SessionEventHandler } from "@/app/openvidu/type";
import { joinSession } from "@/app/openvidu/api";

interface OptionsType {
  sessionId: string;
  clientData?: any;
  eventHandlers?: SessionEventHandler<any>[];
  publisherProperties?: PublisherProperties;
}

interface ReturnType {
  ov?: OpenVidu;
  session?: Session;
  myStream?: Publisher;
  subscribers?: StreamManager[];
}

function useOpenVidu({
  sessionId,
  clientData,
  eventHandlers = [],
  publisherProperties,
}: OptionsType): ReturnType {
  const [ov, setOv] = useState<OpenVidu>();
  const [session, setSession] = useState<Session>();
  const [myStream, setMyStream] = useState<Publisher>();
  const [subscribers, setSubscribers] = useState<StreamManager[]>([]);

  // 세션 아이디가 변경될 때마다 세션에 다시 연결
  useEffect(() => {
    async function joinNewSession(sessionId: string) {
      const ov = new OpenVidu();
      const session = ov.initSession();
      registerDefaultEventHandler(eventHandlers, session, setSubscribers);
      const myStream = await joinSession({
        sessionId,
        ov,
        session,
        eventHandlers,
        clientData,
        publisherProperties,
      });

      // 상태 업데이트
      setOv(ov);
      setSession(session);
      setMyStream(myStream);
    }

    joinNewSession(sessionId);
  }, [sessionId]);

  return {
    ov,
    session,
    myStream,
    subscribers,
  };
}

function registerDefaultEventHandler(
  eventHandlers: SessionEventHandler<keyof SessionEventMap>[],
  session: Session,
  setSubscribers: Dispatch<SetStateAction<StreamManager[]>>,
) {
  // streamCreated 이벤트 핸들러 등록
  const streamCreatedEventHandler = eventHandlers?.find(
    (event) => event.type === "streamCreated",
  )?.handler;

  session.on("streamCreated", (event) => {
    if (streamCreatedEventHandler) {
      streamCreatedEventHandler(event);
    }
    const subscriber = session.subscribe(event.stream, undefined);
    setSubscribers((prevSubscribers) => [...prevSubscribers, subscriber]);
  });

  // streamDestroyed 이벤트 핸들러 등록
  const streamDestroyedEventHandler = eventHandlers?.find(
    (event) => event.type === "streamDestroyed",
  )?.handler;

  session.on("streamDestroyed", (event) => {
    if (streamDestroyedEventHandler) {
      streamDestroyedEventHandler(event);
    }
    setSubscribers((prevSubscribers) =>
      deleteSubscriber(event.stream, prevSubscribers),
    );
  });
}

function deleteSubscriber(stream: Stream, subscribers: StreamManager[]) {
  return subscribers.filter((subscriber) => subscriber.stream !== stream);
}

export default useOpenVidu;
