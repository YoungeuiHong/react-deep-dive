import { useEffect } from "react";
import { useAtom } from "jotai";
import {
  OpenVidu,
  Publisher,
  PublisherProperties,
  Session,
  StreamManager,
} from "openvidu-browser";
import { SessionEventHandler } from "@/app/openvidu/constants";
import { joinSession } from "@/app/openvidu/api";
import {
  myStreamAtom,
  openViduAtom,
  sessionAtom,
  subscribersAtom,
} from "@/app/openvidu/store";
import { registerDefaultEventHandler } from "@/app/openvidu/utils";

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
  const [ov, setOv] = useAtom<OpenVidu | undefined>(openViduAtom);
  const [session, setSession] = useAtom<Session | undefined>(sessionAtom);
  const [myStream, setMyStream] = useAtom<Publisher | undefined>(myStreamAtom);
  const [subscribers, setSubscribers] =
    useAtom<StreamManager[]>(subscribersAtom);

  // 세션 아이디가 변경될 때마다 세션에 다시 연결
  useEffect(() => {
    async function joinNewSession(sessionId: string) {
      const ov = new OpenVidu();
      const session = ov.initSession();
      // 기본 이벤트 핸들러 등록 (Stream 추가 / 제거)
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

  // 페이지를 벗어날 때 세션 연결 해제
  useEffect(() => {
    const beforeUnload = (event: BeforeUnloadEvent) => {
      // 세션 연결 해제
      session?.disconnect();
      // atom 초기화
      setOv(undefined);
      setSession(undefined);
      setMyStream(undefined);
      setSubscribers([]);
      event.returnValue = true;
    };

    window.addEventListener("beforeunload", beforeUnload);

    return () => {
      window.removeEventListener("beforeunload", beforeUnload);
    };
  }, []);

  return {
    ov,
    session,
    myStream,
    subscribers,
  };
}

export default useOpenVidu;
