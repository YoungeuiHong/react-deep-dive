import { atom } from "jotai";
import { OpenVidu, Publisher, Session, StreamManager } from "openvidu-browser";

export const openViduAtom = atom<OpenVidu | undefined>(undefined);
export const sessionAtom = atom<Session | undefined>(undefined);
export const myStreamAtom = atom<Publisher | undefined>(undefined);
export const subscribersAtom = atom<StreamManager[]>([]);
