/// <reference types="node" />
import IVoiceService from '../../models/IVoiceService';
import { VoiceLanguage } from "../../models/VoiceLanguages";
import { AzureSpeechVoice } from "../../models/VoiceSpeaker";
import { AudioStream } from "../../models/AudioStream";
import { VoiceTranslateResult } from "../../models/VoiceTranslateResult";
declare class AzureService implements IVoiceService {
    private speechConfig;
    private translationConfig;
    private apiVersion;
    constructor();
    handleError(error: Error): void;
    logDebug(...params: any[]): void;
    textToSpeech(text: string, params: {
        language: VoiceLanguage;
        format?: "mp3" | "pcm";
        voice?: AzureSpeechVoice;
    }): Promise<Buffer | null>;
    speechRecognize(audioStream: AudioStream, params: {
        language: VoiceLanguage;
    }, callback?: ((data: string | null) => void) | undefined): Promise<string | null>;
    speechTranslate(audioStream: AudioStream, params: {
        from: VoiceLanguage;
        to: VoiceLanguage[];
        tts?: boolean;
        ttsFormat?: "mp3" | "pcm";
        ttsVoice?: AzureSpeechVoice;
    }, callback?: (result: VoiceTranslateResult) => void): Promise<VoiceTranslateResult[] | null>;
    private getLanguageConfig;
}
export default AzureService;
