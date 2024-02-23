import { openViduApi } from "@/app/openvidu/api/index";

/**
 * OpenVidu 세션 생성
 * @param sessionId
 */
export async function createOpenViduSession(
  sessionId: string,
): Promise<string> {
  return openViduApi
    .post(`/openvidu/api/sessions`, {
      customSessionId: sessionId,
    })
    .then(({ data }) => data)
    .catch((error) => {
      if (error.response.status === 409) {
        return sessionId;
      } else {
        throw error;
      }
    });
}
