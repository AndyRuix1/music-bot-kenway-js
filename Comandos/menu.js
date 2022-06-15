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
const Helpers_1 = require("../MusicControl/Embeds/Helpers");
const UsualEmbeds_1 = require("../MusicControl/Embeds/UsualEmbeds");
const Menu_1 = require("../MusicControl/Functions/Menu");
const utils_1 = require("../MusicControl/Functions/utils");
module.exports = new discord_kenway_handler_1.Comando({
    nombre: 'menu',
    descripcion: 'Menú interactivo para la reproducción de música.',
    ejecutar: (client, interaction) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        if (!interaction || !(interaction === null || interaction === void 0 ? void 0 : interaction.guild))
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
        if ((_b = listener === null || listener === void 0 ? void 0 : listener.menu) === null || _b === void 0 ? void 0 : _b.isStart)
            return interaction.reply({ embeds: [{ title: `${Helpers_1.emojis.redCircle} | NO ACTIVADO`, description: `El menú ya se encuentra activo.`, color: 'RED' }] });
        yield interaction.reply({ embeds: [{ title: `${Helpers_1.emojis.orangeCircle} | ACTIVANDO...`, description: `Se está creando y activando el menú, espera un momento...`, color: 'ORANGE' }] });
        const menuCreated = new Menu_1.Menu({ guildId: interaction.guildId });
        listener.menu = {
            isStart: true,
            menu: menuCreated
        };
        interaction.deleteReply().catch(() => { });
    })
});
