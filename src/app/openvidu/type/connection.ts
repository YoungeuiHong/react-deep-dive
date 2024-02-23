/**
 * 세션 connect를 할 때 metadata로 전달된 정보
 * https://docs.openvidu.io/en/stable/reference-docs/REST-API/#the-connection-object
 */
export interface ConnectionMetaData {
  clientData: string;
  [key: string]: any;
}
