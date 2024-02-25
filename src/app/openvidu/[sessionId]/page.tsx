"use client";
import { useState } from "react";
import type { SessionEventHandler } from "@/app/openvidu/constants";
import { useOpenVidu } from "@/app/openvidu/hook";
import {
  DeviceSelectBar,
  LeftUserBanner,
  OpenViduVideo,
  OutlinedButton,
} from "@/app/openvidu/components";
import { parseUserName } from "@/app/openvidu/utils";

export default function OpenViduPage({
  params,
}: {
  params: { sessionId: string };
}) {
  // 세션 아이디
  const { sessionId = "doldolmeet-session" } = params;
  // 접속 여부
  const [connect, setConnect] = useState<boolean>(false);
  // 접속자명
  const [userName, setUserName] = useState<string>(
    `user-${Math.floor(Math.random() * 100)}`,
  );
  // 나간 접속자 목록
  const [leftUsers, setLeftUsers] = useState<string[]>([]);

  // streamCreated 이벤트 핸들러
  const handleStreamCreated: SessionEventHandler<"streamCreated"> = {
    type: "streamCreated",
    handler: (event) => {
      console.log("👋🏻 streamCreated 이벤트 발생");
    },
  };

  // connectionDestroyed 이벤트 핸들러
  const handleSessionDisconnected: SessionEventHandler<"connectionDestroyed"> =
    {
      type: "connectionDestroyed",
      handler: (event) => {
        console.log("🔥 connectionDestroyed 이벤트 발생");
        setLeftUsers((prev) => [...prev, parseUserName(event.connection.data)]);
      },
    };

  // OpenVidu 연결
  const { myStream, subscribers } = useOpenVidu({
    sessionId,
    connect,
    clientData: { userName },
    eventHandlers: [handleSessionDisconnected, handleStreamCreated],
  });

  return (
    <div className="container mx-auto p-4">
      <LeftUserBanner leftUsers={leftUsers} />
      <div className="flex float-left mb-2">
        {connect ? (
          <DeviceSelectBar />
        ) : (
          <OutlinedButton
            content={"영상통화방 연결"}
            onClick={() => setConnect(true)}
          />
        )}
      </div>
      <div className="clear-both columns-1 md:columns-2">
        {myStream && <OpenViduVideo key={myStream.id} stream={myStream} />}
        {subscribers?.map((manager) => (
          <OpenViduVideo key={manager.id} stream={manager} />
        ))}
      </div>
    </div>
  );
}
