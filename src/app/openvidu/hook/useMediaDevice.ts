import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { Device, OpenVidu, Publisher, Session } from "openvidu-browser";
import { myStreamAtom, openViduAtom, sessionAtom } from "@/app/openvidu/store";

export default function useMediaDevice() {
  // atom
  const [ov, setOv] = useAtom<OpenVidu>(openViduAtom);
  const [session, setSession] = useAtom<Session>(sessionAtom);
  const [myStream, setMyStream] = useAtom<Publisher | undefined>(myStreamAtom);
  // state
  const [audioInputs, setAudioInputs] = useState<Device[]>([]);
  const [videoInputs, setVideoInputs] = useState<Device[]>([]);
  const [selectedAudio, setSelectedAudio] = useState<Device>();
  const [selectedVideo, setSelectedVideo] = useState<Device>();

  useEffect(() => {
    async function init() {
      if (ov) {
        const devices = await ov.getDevices();
        const audioDevices = devices.filter(
          (device) => device.kind === "audioinput",
        );
        const videoDevices = devices.filter(
          (device) => device.kind === "videoinput",
        );
        setAudioInputs(audioDevices);
        setVideoInputs(videoDevices);
      }
    }

    init();
  }, [ov]);

  // 카메라 / 마이크 선택이 변경될 경우 변경된 Publisher 스트림을 세션에 배포
  useEffect(() => {
    async function changeDevice() {
      const newPublisher = ov.initPublisher(undefined, {
        videoSource: selectedVideo?.deviceId,
        audioSource: selectedAudio?.deviceId,
        publishAudio: true,
        publishVideo: true,
      });
      if (myStream) {
        await session.unpublish(myStream);
      }
      await session.publish(newPublisher);
    }

    changeDevice();
  }, [selectedAudio, selectedVideo]);

  // 마이크 변경
  function changeMic(deviceId: string) {
    const selected = audioInputs.find((audio) => audio.deviceId === deviceId);

    setSelectedAudio(selected);
  }

  // 카메라 변경
  function changeCamera(deviceId: string) {
    const selected = videoInputs.find((video) => video.deviceId === deviceId);

    setSelectedVideo(selected);
  }

  return {
    audioInputs,
    videoInputs,
    selectedAudio,
    selectedVideo,
    changeMic,
    changeCamera,
  };
}
