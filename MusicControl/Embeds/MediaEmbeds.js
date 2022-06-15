"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaylistAddedEmbed = exports.RetryConnectEmbed = exports.PlayerErrorEmbed = exports.ErrorEmbed = exports.DisconnectedEmbed = exports.MusicStoppedEmbed = exports.SkippedSongEmbed = exports.AddedToQueueEmbed = exports.MusicUnpausedEmbed = exports.MusicPausedEmbed = exports.PlayingNowEmbed = void 0;
const discord_kenway_handler_1 = require("discord-kenway-handler");
const utils_1 = require("../Functions/utils");
const MusicList_1 = require("../Media/MusicList");
const Helpers_1 = require("./Helpers");
const PlayingNowEmbed = (channel, guildId, onQueue) => {
    var _a, _b;
    const playingNow = (0, MusicList_1.getMusicGuild)(guildId).playingNow;
    onQueue = onQueue !== null && onQueue !== void 0 ? onQueue : 0;
    const embed = new discord_kenway_handler_1.MessageEmbed()
        .setTitle(`${Helpers_1.emojis.play} | REPRODUCCIÓN`)
        .setDescription(`Canción en reproducción:\n[${playingNow.title}](${playingNow.url})\n**Duración:** ${playingNow.duration}\n**Ingresada por:** ${playingNow.putBy}\n${(0, utils_1.getMusicDescription)(playingNow)}`)
        .setThumbnail(playingNow.thumbnail)
        .setImage(Helpers_1.gifs.musicLine)
        .setColor('GREEN')
        .setTimestamp()
        .setFooter({ text: `${onQueue} Canciones en cola.`, iconURL: (_b = (_a = playingNow.putBy) === null || _a === void 0 ? void 0 : _a.avatarURL()) !== null && _b !== void 0 ? _b : '' });
    channel.send({ embeds: [embed] });
};
exports.PlayingNowEmbed = PlayingNowEmbed;
const MusicPausedEmbed = (channel) => {
    const embed = new discord_kenway_handler_1.MessageEmbed()
        .setTitle(`${Helpers_1.emojis.pause} | PAUSA`)
        .setDescription(`La música en reproducción ha sido pausada.`)
        .setColor('GREEN')
        .setImage(Helpers_1.gifs.spy)
        .setTimestamp();
    channel.send({ embeds: [embed] });
};
exports.MusicPausedEmbed = MusicPausedEmbed;
const MusicUnpausedEmbed = (channel) => {
    const embed = new discord_kenway_handler_1.MessageEmbed()
        .setTitle(`${Helpers_1.emojis.play} | DESPAUSA`)
        .setDescription(`La música en reproducción ha sido despausada.`)
        .setColor('GREEN')
        .setImage(Helpers_1.gifs.musicLine)
        .setTimestamp();
    channel.send({ embeds: [embed] });
};
exports.MusicUnpausedEmbed = MusicUnpausedEmbed;
const AddedToQueueEmbed = (music, channel, onQueue) => {
    var _a, _b;
    const embed = new discord_kenway_handler_1.MessageEmbed()
        .setTitle(`${Helpers_1.emojis.downArrow} | AGREGADO`)
        .setDescription(`Nueva canción agregada a la cola:\n[${music.title}](${music.url})\n**Duración:** ${music.duration}\n**Ingresada por:** ${music.putBy}\n${(0, utils_1.getMusicDescription)(music)}\n_Usa el comando \`omitir ${onQueue > 1 ? onQueue : ''}\` para reproducir esta canción inmediatamente_`)
        .setThumbnail(music.thumbnail)
        .setImage(Helpers_1.gifs.whiteAndBlueBar)
        .setColor('GREEN')
        .setTimestamp()
        .setFooter({ text: `${onQueue !== null && onQueue !== void 0 ? onQueue : 0} Canciones en cola.`, iconURL: (_b = (_a = music.putBy) === null || _a === void 0 ? void 0 : _a.avatarURL()) !== null && _b !== void 0 ? _b : '' });
    channel.send({ embeds: [embed] });
};
exports.AddedToQueueEmbed = AddedToQueueEmbed;
const SkippedSongEmbed = (music, channel, onQueue, cantidad) => {
    var _a, _b;
    onQueue = onQueue !== null && onQueue !== void 0 ? onQueue : 0;
    const embed = new discord_kenway_handler_1.MessageEmbed()
        .setTitle(`${Helpers_1.emojis.skip} | OMITIDO`)
        .setDescription(`La canción actual se ha omitido correctamente:\n[${music.title}](${music.url})\n**Duración:** ${music.duration}\n**Ingresada por:** ${music.putBy}\n${(0, utils_1.getMusicDescription)(music)}\n**Se ha(n) omitido ${cantidad} cancion(es)**`)
        .setThumbnail(music.thumbnail)
        .setImage(Helpers_1.gifs.musicLine)
        .setColor('GREEN')
        .setTimestamp()
        .setFooter({ text: `Ahora hay ${onQueue} canciones en cola.`, iconURL: (_b = (_a = music.putBy) === null || _a === void 0 ? void 0 : _a.avatarURL()) !== null && _b !== void 0 ? _b : '' });
    channel.send({ embeds: [embed] });
};
exports.SkippedSongEmbed = SkippedSongEmbed;
const MusicStoppedEmbed = (channel) => {
    const embed = new discord_kenway_handler_1.MessageEmbed()
        .setTitle(`${Helpers_1.emojis.stop} | DETENIDO`)
        .setDescription(`La música en la lista de reproducción ha finalizado.`)
        .setColor('GREEN')
        .setImage(Helpers_1.gifs.spy)
        .setTimestamp();
    channel.send({ embeds: [embed] });
};
exports.MusicStoppedEmbed = MusicStoppedEmbed;
const DisconnectedEmbed = (channel) => {
    const embed = new discord_kenway_handler_1.MessageEmbed()
        .setTitle(`${Helpers_1.emojis.exclamation} | DESCONECTADO`)
        .setDescription(`Se ha desconectado el reproductor.`)
        .setImage(Helpers_1.gifs.redLine)
        .setColor('YELLOW')
        .setTimestamp();
    channel.send({ embeds: [embed] });
};
exports.DisconnectedEmbed = DisconnectedEmbed;
const ErrorEmbed = (channel) => {
    const embed = new discord_kenway_handler_1.MessageEmbed()
        .setTitle(`${Helpers_1.emojis.exclamation} | ERROR EN REPRODUCCIÓN`)
        .setDescription(`Ha ocurrido un error interno fatal que impide continuar la reproducción.\nSe intentará reiniciar la canción actual conservando la lista actual.`)
        .setColor('RED')
        .setImage(Helpers_1.gifs.redLine)
        .setTimestamp();
    channel.send({ embeds: [embed] });
};
exports.ErrorEmbed = ErrorEmbed;
const PlayerErrorEmbed = (channel) => {
    const embed = new discord_kenway_handler_1.MessageEmbed()
        .setTitle(`${Helpers_1.emojis.exclamation} | ERROR EN REPRODUCCIÓN`)
        .setDescription(`Ha ocurrido un error en el reproductor, posiblemente la reproducción continúe.`)
        .setColor('RED')
        .setImage(Helpers_1.gifs.redLine)
        .setTimestamp();
    channel.send({ embeds: [embed] });
};
exports.PlayerErrorEmbed = PlayerErrorEmbed;
const RetryConnectEmbed = (channel) => {
    const embed = new discord_kenway_handler_1.MessageEmbed()
        .setTitle(`${Helpers_1.emojis.exclamation} | RECONECTADO`)
        .setDescription(`Se ha detectado una desconexión forzada, se ha reconectado y se ha puesto en reproducción la última canción conocida.\nSi necesitas desconectar la música y borrar la cola, utiliza el comando 'detener'`)
        .setColor('RED')
        .setImage(Helpers_1.gifs.redLine)
        .setTimestamp();
    channel.send({ embeds: [embed] });
};
exports.RetryConnectEmbed = RetryConnectEmbed;
const PlaylistAddedEmbed = (channel, onQueue) => {
    const embed = new discord_kenway_handler_1.MessageEmbed()
        .setTitle(`${Helpers_1.emojis.greenCircle} | PLAYLIST AGREGADA`)
        .setDescription(`Se ha insertado exitosamente una PlayList.`)
        .setImage(Helpers_1.gifs.musicLine)
        .setColor('GREEN')
        .setTimestamp()
        .setFooter({ text: `Ahora hay ${onQueue} canciones en cola.` });
    channel.send({ embeds: [embed] });
};
exports.PlaylistAddedEmbed = PlaylistAddedEmbed;
