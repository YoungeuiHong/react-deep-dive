import { atom } from "jotai";
import { OpenVidu, Publisher, Session, StreamManager } from "openvidu-browser";

export const openViduAtom = atom<OpenVidu>(new OpenVidu());
export const sessionAtom = atom<Session>(new OpenVidu().initSession());
export const myStreamAtom = atom<Publisher | undefined>(undefined);
export const subscribersAtom = atom<StreamManager[]>([]);
