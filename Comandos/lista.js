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
const index_1 = require("../MusicControl/index");
const CreateListPaginated_1 = require("../MusicControl/Functions/CreateListPaginated");
const utils_1 = require("../MusicControl/Functions/utils");
module.exports = new discord_kenway_handler_1.Comando({
    nombre: 'lista',
    descripcion: 'Obtener la lista de reproducción actual, actualizando en tiempo real',
    ejecutar: (client, interaction) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (!interaction.guildId || !interaction.channel)
            return;
        const member = (0, utils_1.getMember)(client, interaction);
        if (!member.voice.channel)
            return interaction.reply({ ephemeral: true, embeds: [{ title: `🛑 | No Conectado`, description: 'Para reproducir una canción, debes estar conectado a un canal de voz.', color: 'RED' }] });
        const listener = (0, index_1.getMusicGuild)(interaction.guildId);
        if (!((_a = listener === null || listener === void 0 ? void 0 : listener.playingNow) === null || _a === void 0 ? void 0 : _a.isPlaying))
            return interaction.reply({ embeds: [{ title: `🛑 | Sin Reproducción`, description: `Actualmente no hay una reproducción activa.`, color: 'RED' }] });
        yield interaction.reply({ embeds: [{ title: `📃 | LISTA DE MUSICA`, description: `Cargando listado de música...`, color: 'AQUA' }] });
        yield new CreateListPaginated_1.default({
            channel: listener.textChannel,
            filter: (btn) => btn.user.id == interaction.user.id,
            guildId: interaction.guildId,
            time: 120000,
            resetAuto: true
        }).listen();
        interaction.deleteReply().catch(() => { });
    })
});
