import { VoiceLanguage } from "./VoiceLanguages"

// export type VoiceTranslateResult = {
//     language: VoiceLanguage,
//     text: {
//         from: string,
//         to: string
//     },
//     voice?: Buffer
// }

export type VoiceTransalteResItem = {
    language: VoiceLanguage,
    text: string,
}

export type VoiceTransalteResTTSData = {
    language: VoiceLanguage,
    data: Buffer
}

export type VoiceTranslateResponse = {
    from: VoiceTransalteResItem,
    translations?: VoiceTransalteResItem[],
    TTSs?: VoiceTransalteResTTSData[]
}