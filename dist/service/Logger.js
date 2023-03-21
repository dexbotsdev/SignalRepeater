"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("@ptkdev/logger"));
const options = {
    "language": "en",
    "colors": true,
    "debug": true,
    "info": true,
    "warning": true,
    "error": true,
    "sponsor": true,
    "write": true,
    "type": "log",
    "rotate": {
        "size": "10M",
        "encoding": "utf8"
    },
    "path": {
        "debug_log": "./logs/debug.log",
        "error_log": "./logs/errors.log", // only errors logs
    },
    "palette": {
        "info": {
            "label": "#ffffff",
            "text": "#2ECC71",
            "background": "#2ECC71" // background
        },
        "warning": {
            "label": "#ffffff",
            "text": "#FF9800",
            "background": "#FF9800"
        },
        "error": {
            "label": "#ffffff",
            "text": "#FF5252",
            "background": "#FF5252"
        },
        "stackoverflow": {
            "label": "#ffffff",
            "text": "#9C27B0",
            "background": "#9C27B0"
        },
        "docs": {
            "label": "#ffffff",
            "text": "#FF4081",
            "background": "#FF4081"
        },
        "debug": {
            "label": "#ffffff",
            "text": "#1976D2",
            "background": "#1976D2"
        },
        "sponsor": {
            "label": "#ffffff",
            "text": "#607D8B",
            "background": "#607D8B"
        },
        "time": {
            "label": "#ffffff",
            "background": "#795548"
        }
    }
};
const logger = new logger_1.default(options);
exports.default = logger;
