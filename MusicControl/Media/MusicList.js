"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMusicGuild = exports.setGlobalClient = exports.globalClient = exports.MusicList = void 0;
exports.MusicList = new Array();
const setGlobalClient = (client) => exports.globalClient = client;
exports.setGlobalClient = setGlobalClient;
const getMusicGuild = (guildId) => {
    const listener = exports.MusicList.find(listener => listener.guild.id == guildId);
    if (!listener)
        return {};
    return listener;
};
exports.getMusicGuild = getMusicGuild;
