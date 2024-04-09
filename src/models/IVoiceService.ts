// src/models/IVoiceService.ts

import { Readable } from "stream";
import { VoiceLanguage } from "./VoiceLanguages";
import { VoiceSpeaker } from "./VoiceSpeaker";

interface IVoiceService {
    // tts 文字转语音
    textToSpeech(
        text: string,
        params: {
            language: VoiceLanguage,
            format: "mp3" | "pcm",
            voice?: VoiceSpeaker
        }
    ): Promise<Buffer | null>;

    // asr 语音转文字
    speechRecognize(
        audioStream: Readable,
        params: {
            language: VoiceLanguage
        },
        callback?: (data: string | null) => void
    ): Promise<string | null>;

    // 语音翻译
    speechTranslateToSpeech(
        audioStream: Readable,
        params: {
            from: VoiceLanguage,
            to: VoiceLanguage | VoiceLanguage[]
        }
    ): Promise<Buffer | null>;

    handleError(error: Error): void;
    logDebug(...params: any[]): void;

}

export default IVoiceService;
