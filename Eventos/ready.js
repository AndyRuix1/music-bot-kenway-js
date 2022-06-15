"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_kenway_handler_1 = require("discord-kenway-handler");
const MusicControl_1 = require("../MusicControl");
module.exports = new discord_kenway_handler_1.Evento({
    nombre: 'ready',
    ejecutar: (client) => {
        if (!client)
            return;
        (0, MusicControl_1.setGlobalClient)(client);
    }
});
