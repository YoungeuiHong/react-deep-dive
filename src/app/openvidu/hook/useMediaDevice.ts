import { useEffect, useState } from "react";
import { useAtom, useAtomValue } from "jotai";
import {
  Device,
  OpenVidu,
  Publisher,
  PublisherProperties,
  Session,
} from "openvidu-browser";
import { myStreamAtom, openViduAtom, sessionAtom } from "@/app/openvidu/store";
import { defaultPublisherProperties } from "@/app/openvidu/constants";

interface OptionType {
  publisherProperties?: PublisherProperties;
}

interface ReturnType {
  audioInputs: Device[];
  videoInputs: Device[];
  selectedAudio: Device | undefined;
  selectedVideo: Device | undefined;
  changeMic: (deviceId: string) => void;
  changeCamera: (deviceId: string) => void;
}

export default function useMediaDevice({
  publisherProperties = defaultPublisherProperties,
}: OptionType = {}): ReturnType {
  // atom
  const ov = useAtomValue<OpenVidu>(openViduAtom);
  const session = useAtomValue<Session>(sessionAtom);
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
        setSelectedAudio(audioDevices[0]);
        setSelectedVideo(videoDevices[0]);
      }
    }

    init();
  }, [ov, session]);

  // 카메라 / 마이크 선택이 변경될 경우 변경된 Publisher 스트림을 세션에 배포
  useEffect(() => {
    async function changeDevice() {
      const newPublisher = await ov.initPublisherAsync(undefined, {
        ...publisherProperties,
        videoSource: selectedVideo?.deviceId,
        audioSource: selectedAudio?.deviceId,
      });
      if (myStream) {
        await session.unpublish(myStream);
      }
      setMyStream(newPublisher);
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
