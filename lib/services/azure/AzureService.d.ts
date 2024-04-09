/// <reference types="node" />
import IVoiceService from '../../models/IVoiceService';
import { VoiceLanguage } from "../../models/VoiceLanguages";
import { AzureSpeechVoice } from "../../models/VoiceSpeaker";
import { AudioStream } from "../../models/AudioStream";
declare class AzureService implements IVoiceService {
    private speechConfig;
    private apiVersion;
    constructor();
    handleError(error: Error): void;
    logDebug(...params: any[]): void;
    textToSpeech(text: string, params: {
        language: VoiceLanguage;
        format: "mp3" | "pcm";
        voice?: AzureSpeechVoice;
    }): Promise<Buffer | null>;
    speechRecognize(audioStream: AudioStream, params: {
        language: VoiceLanguage;
    }, callback?: ((data: string | null) => void) | undefined): Promise<string | null>;
    speechTranslateToSpeech(audioStream: AudioStream, params: {
        from: VoiceLanguage;
        to: VoiceLanguage | VoiceLanguage[];
    }): Promise<Buffer | null>;
    private getLanguageConfig;
}
export default AzureService;
