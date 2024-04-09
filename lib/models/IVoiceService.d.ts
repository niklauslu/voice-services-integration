/// <reference types="node" />
/// <reference types="node" />
import { Readable } from "stream";
import { VoiceLanguage } from "./VoiceLanguages";
interface IVoiceService {
    textToSpeech(text: string, params: {
        language: VoiceLanguage;
        format: "mp3" | "pcm";
        voice?: string;
    }): Promise<Buffer | null>;
    speechRecognize(audioStream: Readable, params: {
        language: VoiceLanguage;
    }, callback?: (data: string | null) => void): Promise<string | null>;
    speechTranslateToSpeech(audioStream: Readable, params: {
        from: VoiceLanguage;
        to: VoiceLanguage | VoiceLanguage[];
    }): Promise<Buffer | null>;
    handleError(error: Error): void;
    logDebug(...params: any[]): void;
}
export default IVoiceService;
