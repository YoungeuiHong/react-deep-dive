// ClientData 파싱
import { parseClientData } from "@/app/openvidu/utils/index";
import type { User } from "@/app/openvidu/constants";

export default function parseUserName(data: string) {
  if (data) {
    const user = parseClientData<User>(data);
    return user?.userName ?? "";
  }

  return "";
}
