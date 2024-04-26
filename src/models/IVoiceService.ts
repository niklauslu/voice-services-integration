// src/models/IVoiceService.ts

import { Readable } from "stream";
import { VoiceLanguage } from "./VoiceLanguages";
import { VoiceSpeaker } from "./VoiceSpeaker";
import { AudioStream } from "./AudioStream";
import { VoiceTranslateResponse } from "./VoiceTranslateResult";

interface IVoiceService {
    // tts 文字转语音
    textToSpeech(
        text: string,
        params: {
            language: VoiceLanguage,
            format?: "mp3" | "pcm",
            voice?: VoiceSpeaker
        }
    ): Promise<Buffer | null>;

    // asr 语音转文字
    speechRecognize(
        audioStream: AudioStream,
        params: {
            language: VoiceLanguage
        },
        callback?: (data: string | null) => void
    ): Promise<string | null>;

    // 语音翻译
    speechTranslate(
        audioStream: AudioStream,
        params: {
            from: VoiceLanguage,
            to: VoiceLanguage[],
            tts?: boolean,
            ttsVoice?: VoiceSpeaker
        },
        callback?: (results: VoiceTranslateResponse) => void
    ): Promise<VoiceTranslateResponse | null>;

    handleError(error: Error): void;
    logDebug(...params: any[]): void;

}

export default IVoiceService;
