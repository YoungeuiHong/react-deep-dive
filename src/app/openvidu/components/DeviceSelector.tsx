import { ChangeEvent } from "react";
import { Device } from "openvidu-browser";

interface Props {
  id: string;
  label: string;
  value: string | undefined;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  devices: Device[];
}

export default function DeviceSelector({
  id,
  label,
  value,
  onChange,
  devices,
}: Props) {
  return (
    <form className="max-w-sm m-1">
      <label
        htmlFor={id}
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        {label}
      </label>
      <select
        id={id}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        value={value}
        onChange={onChange}
      >
        {devices?.map((device, index) => (
          <option
            key={device.deviceId}
            value={device.deviceId}
            selected={index === 0}
          >
            {device.label}
          </option>
        ))}
      </select>
    </form>
  );
}
