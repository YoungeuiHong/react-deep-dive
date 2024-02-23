import { openViduApi } from "@/app/openvidu/api/index";

/**
 * OpenVidu 커넥션 토큰 생성
 * @param sessionId
 */
export async function createOpenViduConnection(sessionId: string) {
  return openViduApi
    .post(`/openvidu/api/sessions/${sessionId}/connection`)
    .then(({ data }) => data);
}
