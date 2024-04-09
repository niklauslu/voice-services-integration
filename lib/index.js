"use strict";
// src/index.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.Configuration = exports.LCVoiceService = void 0;
var VoiceServiceFactory_1 = require("./services/VoiceServiceFactory");
Object.defineProperty(exports, "LCVoiceService", { enumerable: true, get: function () { return VoiceServiceFactory_1.VoiceServiceFactory; } });
var config_1 = require("./config");
Object.defineProperty(exports, "Configuration", { enumerable: true, get: function () { return config_1.Configuration; } });
