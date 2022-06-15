"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteConnection = exports.createConnection = exports.addToQueue = exports.restartSong = exports.playSong = void 0;
const MusicList_1 = require("./MusicList");
const voice_1 = require("@discordjs/voice");
const index_1 = require("../index");
const Ytdl = require("discord-ytdl-core");
const playSong = (guildId, numberOnTheList) => {
    numberOnTheList = numberOnTheList !== null && numberOnTheList !== void 0 ? numberOnTheList : 0;
    const listener = (0, MusicList_1.getMusicGuild)(guildId);
    //@ts-ignore
    if (listener.connection.listeners('stateChange').length == 0)
        listener.connection.addListener('stateChange', (oldState, newState) => (0, index_1.ConnectionChangeEvent)(oldState, newState, guildId));
    if (listener.connection.listeners('error').length == 0)
        listener.connection.addListener('error', (error) => (0, index_1.ConnectionErrorEvent)(error, guildId));
    //@ts-ignore
    if (listener.player.listeners('stateChange').length == 0)
        listener.player.addListener('stateChange', (oldState, newState) => (0, index_1.PlayerStateChangeEvent)(oldState, newState, guildId));
    if (listener.player.listeners('error').length == 0)
        listener.player.addListener('error', (error) => (0, index_1.PlayerErrorEvent)(error, guildId));
    const toPlay = listener.queue[numberOnTheList];
    const transformSong = Ytdl(toPlay.url, { opusEncoded: true, encoderArgs: ['-af', 'bass=g=10,dynaudnorm=f=200'] });
    const resource = (0, voice_1.createAudioResource)(transformSong, { silencePaddingFrames: 10 });
    listener.previousSong = listener.playingNow;
    listener.playingNow = Object.assign(Object.assign({}, toPlay), { isPlaying: false });
    listener.queue.shift();
    listener.player.play(resource);
    if (!resource.started)
        return false;
    return true;
};
exports.playSong = playSong;
const restartSong = (guildId) => {
    const listener = MusicList_1.MusicList.find(listener => listener.guild.id == guildId);
    if (!listener || !listener.playingNow)
        return false;
    listener.queue.unshift(listener.playingNow);
    return (0, exports.playSong)(guildId, 0);
};
exports.restartSong = restartSong;
const addToQueue = (guildId, music) => {
    const listener = MusicList_1.MusicList.find(listener => listener.guild.id == guildId);
    if (!listener)
        return false;
    if (Array.isArray(music)) {
        listener.queue.push(...music);
        return true;
    }
    ;
    listener.queue.push(music);
    return true;
};
exports.addToQueue = addToQueue;
const createConnection = (memberOrMusicType) => {
    var _a, _b;
    const isReconnect = (memberOrMusicType) => (memberOrMusicType === null || memberOrMusicType === void 0 ? void 0 : memberOrMusicType.textChannel) ? true : false;
    let connection;
    const getGuild = MusicList_1.globalClient.guilds.cache.get(memberOrMusicType.guild.id);
    if (!getGuild || !(getGuild === null || getGuild === void 0 ? void 0 : getGuild.voiceAdapterCreator))
        return false;
    const voiceAdapterCreator = getGuild.voiceAdapterCreator;
    if (isReconnect(memberOrMusicType)) {
        connection = (0, voice_1.joinVoiceChannel)({
            channelId: memberOrMusicType.textChannel.id,
            guildId: memberOrMusicType.guild.id,
            adapterCreator: voiceAdapterCreator
        });
    }
    else {
        if (!((_a = memberOrMusicType === null || memberOrMusicType === void 0 ? void 0 : memberOrMusicType.voice) === null || _a === void 0 ? void 0 : _a.channelId) || !((_b = memberOrMusicType === null || memberOrMusicType === void 0 ? void 0 : memberOrMusicType.guild) === null || _b === void 0 ? void 0 : _b.id))
            return false;
        connection = (0, voice_1.joinVoiceChannel)({
            channelId: memberOrMusicType.voice.channelId,
            guildId: memberOrMusicType.guild.id,
            adapterCreator: voiceAdapterCreator,
        });
    }
    ;
    connection.configureNetworking();
    return connection;
};
exports.createConnection = createConnection;
const deleteConnection = (guildId, deleteListener) => {
    const listener = (0, MusicList_1.getMusicGuild)(guildId);
    if (!(listener === null || listener === void 0 ? void 0 : listener.guild))
        return false;
    try {
        listener === null || listener === void 0 ? void 0 : listener.player.stop();
        listener === null || listener === void 0 ? void 0 : listener.connection.destroy(true);
    }
    catch (e) { }
    ;
    if (deleteListener) {
        const indexOfGuildMusic = MusicList_1.MusicList.findIndex(find => find.guild.id == listener.guild.id);
        MusicList_1.MusicList.splice(indexOfGuildMusic, 1);
    }
    ;
    return true;
};
exports.deleteConnection = deleteConnection;
