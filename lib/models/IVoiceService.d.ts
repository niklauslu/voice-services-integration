/// <reference types="node" />
import { VoiceLanguage } from "./VoiceLanguages";
import { VoiceSpeaker } from "./VoiceSpeaker";
import { AudioStream } from "./AudioStream";
interface IVoiceService {
    textToSpeech(text: string, params: {
        language: VoiceLanguage;
        format: "mp3" | "pcm";
        voice?: VoiceSpeaker;
    }): Promise<Buffer | null>;
    speechRecognize(audioStream: AudioStream, params: {
        language: VoiceLanguage;
    }, callback?: (data: string | null) => void): Promise<string | null>;
    speechTranslateToSpeech(audioStream: AudioStream, params: {
        from: VoiceLanguage;
        to: VoiceLanguage | VoiceLanguage[];
    }): Promise<Buffer | null>;
    handleError(error: Error): void;
    logDebug(...params: any[]): void;
}
export default IVoiceService;
