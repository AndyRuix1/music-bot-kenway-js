"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoSearchResultsEmbed = exports.NoSameTextChannelEmbed = exports.NoSameVoiceChannelEmbed = exports.NoPlayingNowEmbed = exports.NoVoiceChannelEmbed = void 0;
const discord_kenway_handler_1 = require("discord-kenway-handler");
const Helpers_1 = require("./Helpers");
const NoVoiceChannelEmbed = () => {
    const embed = new discord_kenway_handler_1.MessageEmbed()
        .setTitle(`${Helpers_1.emojis.redCircle} | ACCIÓN INVÁLIDA`)
        .setDescription(`No puedes ejecutar esta acción, debes estar dentro de un canal de voz primero.`)
        .setColor('RED')
        .setTimestamp()
        .setImage(Helpers_1.gifs.redLine);
    return embed;
};
exports.NoVoiceChannelEmbed = NoVoiceChannelEmbed;
const NoPlayingNowEmbed = () => {
    const embed = new discord_kenway_handler_1.MessageEmbed()
        .setTitle(`${Helpers_1.emojis.redCircle} | SIN REPRODUCCIÓN`)
        .setDescription(`Actualmente, ningúna canción se encuentra en reproducción.`)
        .setColor('RED')
        .setTimestamp()
        .setImage(Helpers_1.gifs.redLine);
    return embed;
};
exports.NoPlayingNowEmbed = NoPlayingNowEmbed;
const NoSameVoiceChannelEmbed = () => {
    const embed = new discord_kenway_handler_1.MessageEmbed()
        .setTitle(`${Helpers_1.emojis.redCircle} | CANAL INVÁLIDO`)
        .setDescription(`El canal de voz donde estás conectado, no es el mismo donde se configuró para reproducir música automáticamente.`)
        .setColor('RED')
        .setTimestamp()
        .setImage(Helpers_1.gifs.redLine);
    return embed;
};
exports.NoSameVoiceChannelEmbed = NoSameVoiceChannelEmbed;
const NoSameTextChannelEmbed = () => {
    const embed = new discord_kenway_handler_1.MessageEmbed()
        .setTitle(`${Helpers_1.emojis.redCircle} | CANAL INVÁLIDO`)
        .setDescription(`El canal de texto donde estás ejecutando esta solicitud, no es el mismo donde se configuró para escribir comandos automáticamente.`)
        .setColor('RED')
        .setTimestamp()
        .setImage(Helpers_1.gifs.redLine);
    return embed;
};
exports.NoSameTextChannelEmbed = NoSameTextChannelEmbed;
const NoSearchResultsEmbed = () => {
    const embed = new discord_kenway_handler_1.MessageEmbed()
        .setTitle(`${Helpers_1.emojis.redCircle} | SIN RESULTADOS`)
        .setDescription(`La búsqueda no ha tenido resultados.`)
        .setColor('RED')
        .setTimestamp()
        .setImage(Helpers_1.gifs.redLine);
    return embed;
};
exports.NoSearchResultsEmbed = NoSearchResultsEmbed;
