import { VoiceLanguage } from "../../models/VoiceLanguages";
import { AzureSpeechVoice } from "../../models/VoiceSpeaker";
export type AzureSpeechLangRecognize = "zh-CN" | "en-US" | "ko-KR";
export type AzureSpeechLangTTS = "zh-CN" | "en-US" | "ko-KR";
export type AzureSpeechLangTranslation = "zh-Hans" | "en" | "ko";
export type AzureSpeechVoices = AzureSpeechVoice[];
export type AzureSpeechLangData = {
    lang: VoiceLanguage;
    recoginize: AzureSpeechLangRecognize;
    transaltion: AzureSpeechLangTranslation;
    tts: AzureSpeechLangTTS;
    voices: AzureSpeechVoices;
};
export type AzureSpeechLangs = {
    [key: string]: AzureSpeechLangData;
};
export declare const azureSpeechLangs: AzureSpeechLangs;
