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
const MusicList_1 = require("../MusicControl/Media/MusicList");
const discord_kenway_handler_1 = require("discord-kenway-handler");
const UsualEmbeds_1 = require("../MusicControl/Embeds/UsualEmbeds");
const Helpers_1 = require("../MusicControl/Embeds/Helpers");
const utils_1 = require("../MusicControl/Functions/utils");
module.exports = new discord_kenway_handler_1.Comando({
    nombre: 'remover',
    descripcion: 'remover una o más canciones de la lista de reproducción',
    opciones: [
        { nombre: 'desde', descripcion: 'desde donde iniciar la eliminación. Si no se usa "hasta", se elimina solo la indicada.', tipo: 'numerico', requerido: true },
        { nombre: 'hasta', descripcion: 'número de cancion donde terminará la eliminación.', tipo: 'numerico' }
    ],
    ejecutar: (client, interaction) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        if (!interaction.guildId)
            return;
        const member = (0, utils_1.getMember)(client, interaction);
        if (!member.voice.channel)
            return interaction.reply({ embeds: [(0, UsualEmbeds_1.NoVoiceChannelEmbed)()] });
        const removeInit = interaction.options.getNumber('desde', true);
        const removeLast = (_a = interaction.options.getNumber('hasta')) !== null && _a !== void 0 ? _a : removeInit;
        if (removeInit <= 0 || removeLast <= 0)
            return interaction.reply({ embeds: [{ title: `${Helpers_1.emojis.redCircle} | NO REMOVIDO`, description: `El número de inicio o de final para eliminar música de la lista es inválido`, color: 'RED' }] });
        if (removeInit > removeLast)
            return interaction.reply({ embeds: [{ title: `${Helpers_1.emojis.redCircle} | NO REMOVIDO`, description: 'El número de inicio es superior al número de finalización.', color: 'RED' }] });
        const listener = (0, MusicList_1.getMusicGuild)(interaction.guildId);
        if (!((_b = listener === null || listener === void 0 ? void 0 : listener.playingNow) === null || _b === void 0 ? void 0 : _b.isPlaying))
            return interaction.reply({ embeds: [(0, UsualEmbeds_1.NoPlayingNowEmbed)()] });
        if (listener.queue.length == 0)
            return interaction.reply({ embeds: [{ title: `${Helpers_1.emojis.redCircle} | NO REMOVIDO`, description: `No hay música en la lista de reproducción actual.`, color: 'RED' }] });
        if (removeLast > listener.queue.length)
            return interaction.reply({ embeds: [{ title: `${Helpers_1.emojis.redCircle} | NO REMOVIDO`, description: `El número para eliminar música de la lista es superior a la cantidad de canciones en la lista.`, color: 'RED' }] });
        if (listener.voiceChannel.id != member.voice.channelId)
            return interaction.reply({ embeds: [(0, UsualEmbeds_1.NoSameVoiceChannelEmbed)()] });
        if (listener.textChannel.id != interaction.channelId)
            return interaction.reply({ embeds: [(0, UsualEmbeds_1.NoSameTextChannelEmbed)()] });
        yield interaction.reply({ embeds: [{ title: `${Helpers_1.emojis.pin} | REMOVER CANCIÓN`, description: 'Removiendo...', color: 'ORANGE' }] });
        let removed = [];
        if (removeInit === removeLast)
            removed = listener.queue.splice(removeInit - 1, removeInit - 1);
        else
            removed = listener.queue.splice(removeInit - 1, (removeLast - removeInit) + 1);
        interaction.editReply({ embeds: [{ title: `${Helpers_1.emojis.greenCircle} | REMOVIDO`, description: `Se han removido ${removed.length} cancion(es) de la lista satisfactoriamente. Ahora hay ${listener.queue.length} cancion(es) en cola.`, color: 'GREEN' }] });
    })
});
