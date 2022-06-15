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
const voice_1 = require("@discordjs/voice");
const discord_kenway_handler_1 = require("discord-kenway-handler");
const MusicControl_1 = require("../MusicControl");
module.exports = new discord_kenway_handler_1.Comando({
    nombre: 'test',
    descripcion: 'rellenar musica',
    ejecutar: (client, interaction) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f;
        if (!interaction.channel || !interaction.guildId || !interaction.guild)
            return;
        const getMember = (client, interaction) => client.guilds.cache.get(interaction.guild.id).members.cache.get(interaction.user.id);
        const member = getMember(client, interaction);
        if (!member.voice.channel)
            return interaction.reply({ ephemeral: true, embeds: [{ title: `🛑 | No Conectado`, description: 'Para reproducir una canción, debes estar conectado a un canal de voz.', color: 'RED' }] });
        let treeSongs = ['its on eazy e', 'only if you want it', 'gangsta rap made me doit', 'no vaseline ice cube lyrics', 'check yo self ice cube', 'hood took me under', 'san andreas theme song', 'waitin on a sunny day', 'stand by me', 'jersey girl', 'crack a bottle', 'youngstown bruce', 'dopeman lyrics'];
        yield interaction.reply('Inyectando...');
        const connection = (0, MusicControl_1.createConnection)(member);
        if (!connection)
            return;
        const player = (0, voice_1.createAudioPlayer)();
        connection.subscribe(player);
        MusicControl_1.MusicList.push({
            menu: { isStart: false, menu: {} },
            connection: connection,
            player: player,
            guild: interaction.guild,
            playingNow: {},
            previousSong: {},
            repeat: 'disabled',
            queue: [],
            textChannel: interaction.channel,
            voiceChannel: member.voice.channel
        });
        for (var i in treeSongs) {
            let youtube = yield (0, MusicControl_1.ytSearch)(treeSongs[i]);
            if (!youtube)
                return;
            let result = youtube[0];
            const musicInfo = {
                putBy: member,
                title: (_a = result === null || result === void 0 ? void 0 : result.title) !== null && _a !== void 0 ? _a : '',
                description: (_b = result === null || result === void 0 ? void 0 : result.description) !== null && _b !== void 0 ? _b : 'No Encontrada',
                duration: (_c = result === null || result === void 0 ? void 0 : result.duration_raw) !== null && _c !== void 0 ? _c : '',
                thumbnail: (_d = result === null || result === void 0 ? void 0 : result.snippet.thumbnails.url) !== null && _d !== void 0 ? _d : '',
                url: (_e = result === null || result === void 0 ? void 0 : result.url) !== null && _e !== void 0 ? _e : '',
                views: (_f = result === null || result === void 0 ? void 0 : result.views) !== null && _f !== void 0 ? _f : ''
            };
            const listener = MusicControl_1.MusicList.find(r => r.guild.id == interaction.guildId);
            if (!(listener === null || listener === void 0 ? void 0 : listener.queue))
                return;
            listener.queue.push(musicInfo);
        }
        ;
        (0, MusicControl_1.playSong)(interaction.guildId, 0);
        interaction.channel.send(`${treeSongs.length} canciones inyectadas.\n/lista`);
    })
});
