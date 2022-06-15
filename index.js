"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const discord_kenway_handler_1 = require("discord-kenway-handler");
const path_1 = require("path");
new discord_kenway_handler_1.Client({
    token: (_a = process.env.BOT_TOKEN) !== null && _a !== void 0 ? _a : '',
    id: (_b = process.env.BOT_ID) !== null && _b !== void 0 ? _b : '',
    comandos: (0, path_1.join)(__dirname, 'Comandos'),
    eventos: (0, path_1.join)(__dirname, 'Eventos'),
    intents: ['ALL'],
});
