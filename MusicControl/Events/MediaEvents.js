"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionErrorEvent = exports.PlayerErrorEvent = exports.PlayerStateChangeEvent = exports.ConnectionChangeEvent = void 0;
const voice_1 = require("@discordjs/voice");
const index_1 = require("../index");
const util_1 = require("util");
const MediaPlayer_1 = require("../Media/MediaPlayer");
const MediaEmbeds_1 = require("../Embeds/MediaEmbeds");
const MusicList_1 = require("../Media/MusicList");
const utils_1 = require("../Functions/utils");
const Helpers_1 = require("../Embeds/Helpers");
const wait = (0, util_1.promisify)(setTimeout);
const reintents = {
    amount: 0,
    lastReintent: 0
};
const ConnectionChangeEvent = (oldState, newState, guildId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!newState || !newState.status || !guildId)
        return;
    const listener = (0, MusicList_1.getMusicGuild)(guildId);
    if (!(listener === null || listener === void 0 ? void 0 : listener.textChannel))
        return;
    if (newState.status == voice_1.VoiceConnectionStatus.Disconnected) {
        (0, index_1.deleteConnection)(guildId, true);
        return (0, index_1.DisconnectedEmbed)(listener.textChannel);
    }
    ;
});
exports.ConnectionChangeEvent = ConnectionChangeEvent;
const PlayerStateChangeEvent = (oldState, newState, guildId) => {
    var _a;
    const listener = (0, MusicList_1.getMusicGuild)(guildId);
    if (newState.status == voice_1.AudioPlayerStatus.Playing) { //. NUEVA EN REPRODUCCION
        if (oldState.status == voice_1.AudioPlayerStatus.Paused) { // CANCION DESPAUSADA
            listener.playingNow.isPaused = false;
            if ((_a = listener === null || listener === void 0 ? void 0 : listener.menu) === null || _a === void 0 ? void 0 : _a.isStart)
                return;
            return (0, MediaEmbeds_1.MusicUnpausedEmbed)(listener.textChannel);
        }
        ;
        listener.playingNow.isPlaying = true;
        if (listener.menu.isStart) {
            const musicInfoString = (0, utils_1.getMusicInfoStringify)(listener.playingNow, { omit: ['description'] });
            return listener.menu.menu.updateMenu({ updateType: 'notify', message: `Se ha iniciado la reproducción de una nueva canción:\n${musicInfoString}` });
        }
        ;
        (0, index_1.PlayingNowEmbed)(listener.textChannel, guildId, listener.queue.length);
    }
    else if (newState.status == voice_1.AudioPlayerStatus.Paused) { //. PAUSA
        listener.playingNow.isPaused = true;
        if (listener.menu.isStart)
            return;
        (0, MediaEmbeds_1.MusicPausedEmbed)(listener.textChannel);
    }
    else if (newState.status == voice_1.AudioPlayerStatus.Idle) { //. IDLE (fin de canción)
        // .  DETECTOR DE REPETICIÓN
        if (listener.repeat == 'one-time') {
            listener.queue.unshift(listener.playingNow);
            listener.repeat = 'disabled';
            listener.menu.menu.updateMenu({ updateType: 'notify', message: 'Se ha desactivado la repetición automáticamente.' });
            return (0, MediaPlayer_1.playSong)(guildId, 0);
        }
        else if (listener.repeat == 'infinity') {
            listener.queue.unshift(listener.playingNow);
            return (0, MediaPlayer_1.playSong)(guildId, 0);
        }
        ;
        // .FIN DETECTOR DE REPETICIÓN
        //. Menu activado:
        if (listener.menu.isStart) {
            if (listener.queue.length > 0)
                return (0, MediaPlayer_1.playSong)(guildId);
            listener.menu.menu.ListPaginated.stopListen('Se ha cerrado automáticamente');
            listener.menu.menu.updateMenu({ updateType: 'notify', message: `La reproducción ha finalizado. El menú se ha cerrado automáticamente.` });
            listener.menu.isStart = false;
            listener.menu.menu = {};
            return (0, index_1.deleteConnection)(guildId, true);
        }
        ;
        //. Menu desactivado:
        if (listener.queue.length > 0)
            return (0, MediaPlayer_1.playSong)(guildId);
        (0, MediaEmbeds_1.MusicStoppedEmbed)(listener.textChannel);
        (0, index_1.deleteConnection)(guildId, true);
    }
    ;
};
exports.PlayerStateChangeEvent = PlayerStateChangeEvent;
const PlayerErrorEvent = (error, guildId) => {
    if (!error || !guildId)
        return;
    const listener = (0, MusicList_1.getMusicGuild)(guildId);
    if (!(listener === null || listener === void 0 ? void 0 : listener.textChannel))
        return;
    if (listener.menu.isStart)
        return listener.menu.menu.updateMenu({ updateType: 'notify', message: `${Helpers_1.emojis.exclamation} Ha ocurrido un fallo con la reproducción. Posiblemente la reproducción continúe.` });
    (0, MediaEmbeds_1.PlayerErrorEmbed)(listener.textChannel);
};
exports.PlayerErrorEvent = PlayerErrorEvent;
const ConnectionErrorEvent = (error, guildId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!error || !guildId)
        return;
    const listener = (0, MusicList_1.getMusicGuild)(guildId);
    if (!(listener === null || listener === void 0 ? void 0 : listener.textChannel))
        return;
    (0, index_1.ErrorEmbed)(listener.textChannel);
    (0, index_1.deleteConnection)(guildId, false);
    yield wait(2000);
    const tryReintent = reintent();
    if (tryReintent)
        (0, MediaPlayer_1.createConnection)(listener);
    else
        reintent(true);
});
exports.ConnectionErrorEvent = ConnectionErrorEvent;
const reintent = (resetReintents) => {
    if (resetReintents) {
        reintents.amount = 0;
        reintents.lastReintent = 0;
        return true;
    }
    ;
    const finishDate = Math.floor((Date.now() - reintents.lastReintent) / 1000);
    if (finishDate > 20)
        reintents.amount = 0;
    reintents.amount += 1;
    if (reintents.amount >= 5)
        return false;
    return true;
};
