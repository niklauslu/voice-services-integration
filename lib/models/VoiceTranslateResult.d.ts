/// <reference types="node" />
import { VoiceLanguage } from "./VoiceLanguages";
export type VoiceTransalteResItem = {
    language: VoiceLanguage;
    text: string;
};
export type VoiceTransalteResTTSData = {
    language: VoiceLanguage;
    data: Buffer;
};
export type VoiceTranslateResponse = {
    from: VoiceTransalteResItem;
    translations?: VoiceTransalteResItem[];
    TTSs?: VoiceTransalteResTTSData[];
};
