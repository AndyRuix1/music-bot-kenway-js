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
const Helpers_1 = require("../MusicControl/Embeds/Helpers");
const UsualEmbeds_1 = require("../MusicControl/Embeds/UsualEmbeds");
const utils_1 = require("../MusicControl/Functions/utils");
const index_1 = require("../MusicControl/index");
module.exports = new discord_kenway_handler_1.Comando({
    nombre: 'informacion',
    descripcion: 'Obtener información de la reproducción actual.',
    ejecutar: (client, interaction) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (!interaction.guildId || !interaction.channel)
            return;
        const member = (0, utils_1.getMember)(client, interaction);
        if (!member.voice.channel)
            return interaction.reply({ embeds: [(0, UsualEmbeds_1.NoVoiceChannelEmbed)()] });
        const listener = (0, index_1.getMusicGuild)(interaction.guildId);
        if (!((_a = listener === null || listener === void 0 ? void 0 : listener.playingNow) === null || _a === void 0 ? void 0 : _a.isPlaying))
            return interaction.reply({ embeds: [(0, UsualEmbeds_1.NoPlayingNowEmbed)()] });
        if (listener.voiceChannel.id != member.voice.channel.id)
            return interaction.reply({ embeds: [(0, UsualEmbeds_1.NoSameVoiceChannelEmbed)()] });
        if (listener.textChannel.id != interaction.channelId)
            return interaction.reply({ embeds: [(0, UsualEmbeds_1.NoSameTextChannelEmbed)()] });
        const music = listener.playingNow;
        const musicDesc = music.description.length > 1 ? `\n**Descripción:** ${music.description.length > 1200 ? music.description.slice(0, 1200).concat(' ...') : music.description}\n` : '\n';
        const InformationEmbed = new discord_kenway_handler_1.MessageEmbed()
            .setTitle(`${Helpers_1.emojis.play} | REPRODUCIENDO AHORA`)
            .setDescription(`**Título:** [${music.title}](${music.url})${musicDesc}**Duración:** ${music.duration}\n**Vistas:** ${music.views}\n**Ingresada por** ${music.putBy}`)
            .setThumbnail(music.thumbnail)
            .setImage(Helpers_1.gifs.whiteAndBlueBar)
            .setFooter({ text: `${listener.queue.length} cancion(es) en cola.` })
            .setColor('RANDOM')
            .setTimestamp();
        yield interaction.reply({ embeds: [InformationEmbed] }).catch(() => { });
    })
});
