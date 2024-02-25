import { useEffect, useRef } from "react";
import { Publisher, StreamManager } from "openvidu-browser";
import { parseUserName } from "@/app/openvidu/utils";

interface Props {
  stream: Publisher | StreamManager;
}

export default function OpenViduVideo({ stream }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (stream && videoRef.current) {
      stream.addVideoElement(videoRef.current);
    }
  }, [stream]);

  return (
    <div className={"relative rounded-lg overflow-hidden h-2/4 mb-2"}>
      <p className={"absolute top-2 left-2 bg-neutral-100 rounded-lg p-2 z-10"}>
        {parseUserName(stream.stream.connection.data)}
      </p>
      <video id={stream.id} autoPlay={true} ref={videoRef}></video>
    </div>
  );
}
