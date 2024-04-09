import { VoiceLanguage } from "./VoiceLanguages"

export type VoiceTranslateResult = {
    language: VoiceLanguage,
    type: "text" | "audio",
    data: string | Buffer
}

export type VoiceTranslateRes = {
    text: string,
    results: VoiceTranslateResult[]
}