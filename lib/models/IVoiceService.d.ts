/// <reference types="node" />
import { VoiceLanguage } from "./VoiceLanguages";
import { VoiceSpeaker } from "./VoiceSpeaker";
import { AudioStream } from "./AudioStream";
import { VoiceTranslateResponse } from "./VoiceTranslateResult";
interface IVoiceService {
    textToSpeech(text: string, params: {
        language: VoiceLanguage;
        format?: "mp3" | "pcm";
        voice?: VoiceSpeaker;
    }): Promise<Buffer | null>;
    speechRecognize(audioStream: AudioStream, params: {
        language: VoiceLanguage;
    }, callback?: (data: string | null) => void): Promise<string | null>;
    speechTranslate(audioStream: AudioStream, params: {
        from: VoiceLanguage;
        to: VoiceLanguage[];
        tts?: boolean;
        ttsVoice?: VoiceSpeaker;
    }, callback?: (results: VoiceTranslateResponse) => void): Promise<VoiceTranslateResponse | null>;
    handleError(error: Error): void;
    logDebug(...params: any[]): void;
}
export default IVoiceService;
