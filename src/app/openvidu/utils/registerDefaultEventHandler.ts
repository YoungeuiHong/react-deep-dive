import { Dispatch, SetStateAction } from "react";
import {
  Session,
  SessionEventMap,
  Stream,
  StreamManager,
} from "openvidu-browser";
import { SessionEventHandler } from "@/app/openvidu/constants";

export default function registerDefaultEventHandler(
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
