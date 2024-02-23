import parseStringToType from "@/app/openvidu/utils/parseStringToType";
import { ConnectionMetaData } from "@/app/openvidu/type";

export default function parseClientData<T>(data: string): T | undefined {
  if (!data) {
    return undefined;
  }

  const metadata = parseStringToType<ConnectionMetaData>(data, "object");

  return metadata
    ? parseStringToType<T>(metadata.clientData, "object")
    : undefined;
}
