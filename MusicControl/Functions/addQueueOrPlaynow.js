"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const voice_1 = require("@discordjs/voice");
const MediaEmbeds_1 = require("../Embeds/MediaEmbeds");
const MediaPlayer_1 = require("../Media/MediaPlayer");
const MusicList_1 = require("../Media/MusicList");
const utils_1 = require("./utils");
exports.default = ({ type, musicInfo, interaction, notifyWithEmbed }) => {
    if (!interaction || !interaction.guild || !(interaction === null || interaction === void 0 ? void 0 : interaction.guildId) || !(interaction === null || interaction === void 0 ? void 0 : interaction.channel))
        return;
    const listener = (0, MusicList_1.getMusicGuild)(interaction.guildId);
    notifyWithEmbed === undefined || notifyWithEmbed == true ? notifyWithEmbed = true : notifyWithEmbed = false;
    const createFirstPushToMusicList = () => {
        var _a, _b;
        const member = (0, utils_1.getMember)(MusicList_1.globalClient, interaction);
        const connection = (0, MediaPlayer_1.createConnection)(member);
        if (!connection)
            return {};
        const player = (0, voice_1.createAudioPlayer)();
        connection.subscribe(player);
        return {
            menu: { isStart: false, menu: {} },
            connection: connection,
            guild: (_a = interaction === null || interaction === void 0 ? void 0 : interaction.guild) !== null && _a !== void 0 ? _a : {},
            player: player,
            playingNow: {},
            previousSong: {},
            repeat: 'disabled',
            textChannel: interaction.channel,
            voiceChannel: (_b = member.voice.channel) !== null && _b !== void 0 ? _b : {}
        };
    };
    if (Array.isArray(musicInfo)) { //Playlist
        if (!(listener === null || listener === void 0 ? void 0 : listener.guild)) {
            const firstPushProps = createFirstPushToMusicList();
            MusicList_1.MusicList.push(Object.assign(Object.assign({}, firstPushProps), { queue: musicInfo }));
            if (notifyWithEmbed)
                (0, MediaEmbeds_1.PlaylistAddedEmbed)(interaction.channel, musicInfo.length);
            return (0, MediaPlayer_1.playSong)(interaction.guildId, 0);
        }
        ;
        const queued = (0, MediaPlayer_1.addToQueue)(interaction.guildId, musicInfo);
        if (notifyWithEmbed && queued)
            (0, MediaEmbeds_1.PlaylistAddedEmbed)(listener.textChannel, listener.queue.length);
        return;
    }
    ;
    if (type == 'single-play') {
        if (!(listener === null || listener === void 0 ? void 0 : listener.guild)) {
            const firstPushProps = createFirstPushToMusicList();
            MusicList_1.MusicList.push(Object.assign(Object.assign({}, firstPushProps), { queue: [musicInfo] }));
            return (0, MediaPlayer_1.playSong)(interaction.guildId);
        }
        ;
        const queued = (0, MediaPlayer_1.addToQueue)(interaction.guildId, musicInfo);
        if (notifyWithEmbed && queued)
            (0, MediaEmbeds_1.AddedToQueueEmbed)(musicInfo, interaction.channel, listener.queue.length);
    }
    ;
};
