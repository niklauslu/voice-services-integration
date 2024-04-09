"use strict";
// src/services/VoiceServiceFactory.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoiceServiceFactory = void 0;
const AzureService_1 = __importDefault(require("./azure/AzureService"));
// import other services...
class VoiceServiceFactory {
    static getService(provider) {
        switch (provider) {
            case "azure":
                return new AzureService_1.default();
            // case other providers...
            default:
                throw new Error(`Provider ${provider} is not supported.`);
        }
    }
}
exports.VoiceServiceFactory = VoiceServiceFactory;
