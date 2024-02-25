import { useMediaDevice } from "@/app/openvidu/hook";
import { DeviceSelector } from "@/app/openvidu/components/index";

export default function DeviceSelectBar() {
  const {
    audioInputs,
    videoInputs,
    selectedAudio,
    selectedVideo,
    changeMic,
    changeCamera,
  } = useMediaDevice();

  return (
    <>
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
    </>
  );
}
