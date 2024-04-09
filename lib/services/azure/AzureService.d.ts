/// <reference types="node" />
/// <reference types="node" />
import { Readable } from 'stream';
import IVoiceService from '../../models/IVoiceService';
import { VoiceLanguage } from "../../models/VoiceLanguages";
import { AzureSpeechVoice } from "../../models/VoiceSpeaker";
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
    speechRecognize(audioStream: Readable, params: {
        language: VoiceLanguage;
    }, callback?: ((data: string | null) => void) | undefined): Promise<string | null>;
    speechTranslateToSpeech(audioStream: Readable, params: {
        from: VoiceLanguage;
        to: VoiceLanguage | VoiceLanguage[];
    }): Promise<Buffer | null>;
    private getLanguageConfig;
}
export default AzureService;
