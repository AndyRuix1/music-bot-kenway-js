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
const MusicControl_1 = require("../MusicControl/");
const Helpers_1 = require("../MusicControl/Embeds/Helpers");
const UsualEmbeds_1 = require("../MusicControl/Embeds/UsualEmbeds");
const utils_1 = require("../MusicControl/Functions/utils");
module.exports = new discord_kenway_handler_1.Comando({
    nombre: 'pausar',
    descripcion: 'Pausa o despausa la reproducción musical actual.',
    ejecutar: (client, interaction) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (!interaction || !interaction.guildId)
            return;
        const member = (0, utils_1.getMember)(client, interaction);
        if (!member.voice.channel)
            return interaction.reply({ embeds: [(0, UsualEmbeds_1.NoVoiceChannelEmbed)()] });
        const listener = (0, MusicControl_1.getMusicGuild)(interaction.guildId);
        if (!((_a = listener === null || listener === void 0 ? void 0 : listener.playingNow) === null || _a === void 0 ? void 0 : _a.isPlaying))
            return interaction.reply({ embeds: [(0, UsualEmbeds_1.NoPlayingNowEmbed)()] });
        if (listener.voiceChannel.id != member.voice.channelId)
            return interaction.reply({ embeds: [(0, UsualEmbeds_1.NoSameVoiceChannelEmbed)()] });
        if (listener.textChannel.id != interaction.channelId)
            return interaction.reply({ embeds: [(0, UsualEmbeds_1.NoSameTextChannelEmbed)()] });
        yield interaction.reply({ embeds: [{ title: `${Helpers_1.emojis.orangeCircle} | CAMBIANDO ESTADO...`, description: 'Se está cambiando el estado de la reproducción actual...', color: 'ORANGE' }] });
        if (listener.playingNow.isPaused)
            listener.player.unpause();
        else
            listener.player.pause(true);
        interaction.deleteReply();
    })
});
