export type AzureSpeechLangRecognize = "zh-CN" | "en-US" | "ko-KR";
export type AzureSpeechLangTTS = "zh-CN" | "en-US" | "ko-KR";
export type AzureSpeechLangTranslation = "zh-Hans" | "en" | "ko";
export type AzureSpeechVoiceZhCN = "zh-CN-XiaochenMultilingualNeural" | "zh-CN-XiaorouNeural" | "zh-CN-XiaoxiaoDialectsNeural" | "zh-CN-XiaoxiaoMultilingualNeura" | "zh-CN-XiaoyuMultilingualNeural" | "zh-CN-YunjieNeural" | "zh-CN-YunyiMultilingualNeural";
export type AzureSpeechVoiceEnUS = "en-US-AIGenerate1Neural" | "en-US-AIGenerate2Neural" | "en-US-BrianMultilingualNeural" | "en-US-EmmaMultilingualNeural";
export type AzureSpeechVoiceKoKR = "ko-KR-SunHiNeural" | "ko-KR-InJoonNeural" | "ko-KR-BongJinNeural" | "ko-KR-GookMinNeural" | "ko-KR-JiMinNeural" | "ko-KR-SeoHyeonNeural" | "ko-KR-SoonBokNeural" | "ko-KR-YuJinNeural" | "ko-KR-HyunsuNeural";
export type AzureSpeechVoice = AzureSpeechVoiceZhCN | AzureSpeechVoiceEnUS | AzureSpeechVoiceKoKR;
export type AzureSpeechVoices = AzureSpeechVoice[];
export type AzureSpeechLangData = {
    recoginize: AzureSpeechLangRecognize;
    transaltion: AzureSpeechLangTranslation;
    tts: AzureSpeechLangTTS;
    voices: AzureSpeechVoices;
};
export type AzureSpeechLangs = {
    [key: string]: AzureSpeechLangData;
};
export declare const azureSpeechLangs: AzureSpeechLangs;
