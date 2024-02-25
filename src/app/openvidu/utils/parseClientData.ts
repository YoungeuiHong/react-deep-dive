import parseStringToType from "@/app/openvidu/utils/parseStringToType";
import type { ConnectionMetaData } from "@/app/openvidu/constants";

export default function parseClientData<T>(data: string): T | undefined {
  if (!data) {
    return undefined;
  }

  const metadata = parseStringToType<ConnectionMetaData>(data, "object");

  return metadata
    ? parseStringToType<T>(metadata.clientData, "object")
    : undefined;
}
