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
const discord_kenway_handler_1 = require("discord-kenway-handler");
const MusicControl_1 = require("../MusicControl");
const UsualEmbeds_1 = require("../MusicControl/Embeds/UsualEmbeds");
const util_1 = require("util");
const Helpers_1 = require("../MusicControl/Embeds/Helpers");
const utils_1 = require("../MusicControl/Functions/utils");
const wait = (0, util_1.promisify)(setTimeout);
module.exports = new discord_kenway_handler_1.Comando({
    nombre: 'omitir',
    opciones: [{ nombre: 'cantidad', tipo: 'numerico', descripcion: 'omitir hasta X canciones de un solo golpe' }],
    descripcion: 'Omitir la canción en reproducción',
    ejecutar: (client, interaction) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        if (!interaction.guildId || !interaction.channel)
            return;
        const member = (0, utils_1.getMember)(client, interaction);
        if (!member.voice.channel)
            return interaction.reply({ embeds: [(0, UsualEmbeds_1.NoVoiceChannelEmbed)()] });
        let skipSongs = (_a = interaction.options.getNumber('cantidad')) !== null && _a !== void 0 ? _a : 1;
        if (skipSongs <= 0)
            skipSongs = 1;
        const listener = (0, MusicControl_1.getMusicGuild)(interaction.guildId);
        if (!((_b = listener === null || listener === void 0 ? void 0 : listener.playingNow) === null || _b === void 0 ? void 0 : _b.isPlaying))
            return interaction.reply({ embeds: [(0, UsualEmbeds_1.NoPlayingNowEmbed)()] });
        if (listener.textChannel.id != interaction.channelId)
            return interaction.reply({ embeds: [(0, UsualEmbeds_1.NoSameTextChannelEmbed)()] });
        if (listener.voiceChannel.id != member.voice.channelId)
            return interaction.reply({ embeds: [(0, UsualEmbeds_1.NoSameVoiceChannelEmbed)()] });
        if (skipSongs > listener.queue.length + 1)
            return interaction.reply({ embeds: [{ title: `${Helpers_1.emojis.redCircle} | NO SALTADO`, description: `Has intentado omitir más cantidad de la posible en este momento.`, color: 'RED' }] });
        listener.playingNow.isPlaying = false;
        yield interaction.reply({ embeds: [{ title: `➡️ | OMITIENDO`, description: `Se están omitiendo ${skipSongs} canción(es)...`, color: 'ORANGE' }] });
        if (skipSongs > 1) {
            skipSongs -= 1;
            for (var skipped = 0; skipped < skipSongs; skipped++) {
                listener.queue.shift();
            }
            ;
        }
        ;
        yield wait(850);
        listener.player.stop(true);
        (0, MusicControl_1.SkippedSongEmbed)(listener.playingNow, interaction.channel, listener.queue.length, skipSongs);
        interaction.deleteReply().catch(() => { });
    })
});
