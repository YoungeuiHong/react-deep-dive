import { useEffect, useState } from "react";
import { PublisherProperties, Stream } from "openvidu-browser";
import { OpenVidu, Publisher, Session, StreamManager } from "openvidu-browser";
import { SessionEventHandler } from "@/app/openvidu/type";
import { joinSession } from "@/app/openvidu/api";

interface OptionsType {
  sessionId: string;
  clientData?: any;
  eventHandlers?: SessionEventHandler[];
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
  eventHandlers,
  publisherProperties,
}: OptionsType): ReturnType {
  const [ov, setOv] = useState<OpenVidu>();
  const [session, setSession] = useState<Session>();
  const [myStream, setMyStream] = useState<Publisher>();
  const [subscribers, setSubscribers] = useState<StreamManager[]>([]);

  // 세션 아이디가 변경될 때마다 세션에 다시 연결
  useEffect(() => {
    async function init(sessionId: string): Promise<ReturnType> {
      const ov = new OpenVidu();
      const session = ov.initSession();
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

      // streamCreated 이벤트 등록
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

      return { ov, session, myStream };
    }

    init(sessionId);
  }, [sessionId]);

  return {
    ov,
    session,
    myStream,
    subscribers,
  };
}
function deleteSubscriber(stream: Stream, subscribers: StreamManager[]) {
  return subscribers.filter((subscriber) => subscriber.stream !== stream);
}

export default useOpenVidu;
