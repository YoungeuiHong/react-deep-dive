"use client";
import { useState } from "react";
import type { SessionEventHandler, User } from "@/app/openvidu/constants";
import { useMediaDevice, useOpenVidu } from "@/app/openvidu/hook";
import { DeviceSelector, OpenViduVideo } from "@/app/openvidu/components";
import { parseClientData } from "@/app/openvidu/utils";

export default function OpenViduPage({
  params,
}: {
  params: { sessionId: string };
}) {
  // 세션 아이디
  const { sessionId = "doldolmeet-session" } = params;
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
    sessionId: sessionId,
    clientData: { userName },
    eventHandlers: [handleSessionDisconnected, handleStreamCreated],
  });

  // Device
  const {
    audioInputs,
    videoInputs,
    selectedAudio,
    selectedVideo,
    changeMic,
    changeCamera,
  } = useMediaDevice();

  // ClientData 파싱
  const parseUserName = (data: string) => {
    const user = parseClientData<User>(data);
    return user?.userName ?? "";
  };

  return (
    <div className="container mx-auto p-4">
      {leftUsers.length > 0 && (
        <p className={"bg-gray-200 rounded-lg p-2 mb-4 w-full"}>
          {`${leftUsers.join(", ")}님이 나갔습니다.`}
        </p>
      )}
      <div className="flex float-left mb-2">
        <DeviceSelector
          id={"camera"}
          label={"카메라"}
          devices={videoInputs}
          value={selectedVideo?.deviceId}
          onChange={(event) => changeCamera(event.target.value)}
        />
        <DeviceSelector
          id={"mic"}
          label={"마이크"}
          devices={audioInputs}
          value={selectedAudio?.deviceId}
          onChange={(event) => changeMic(event.target.value)}
        />
      </div>
      <div className="clear-both columns-3">
        {myStream && (
          <OpenViduVideo
            key={myStream.id}
            userName={parseUserName(myStream.stream.connection.data)}
            stream={myStream}
          />
        )}
        {subscribers?.map((manager) => (
          <OpenViduVideo
            key={manager.id}
            userName={parseUserName(manager.stream.connection.data)}
            stream={manager}
          />
        ))}
      </div>
    </div>
  );
}
