/// <reference types="node" />
import { VoiceLanguage } from "./VoiceLanguages";
export type VoiceTranslateResult = {
    language: VoiceLanguage;
    type: "text" | "audio";
    text: string;
    result: string | Buffer;
};
