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
const UsualEmbeds_1 = require("../MusicControl/Embeds/UsualEmbeds");
const Helpers_1 = require("../MusicControl/Embeds/Helpers");
const TransformYoutubePlaylist_1 = require("../MusicControl/Functions/TransformYoutubePlaylist");
const addQueueOrPlaynow_1 = require("../MusicControl/Functions/addQueueOrPlaynow");
const utils_1 = require("../MusicControl/Functions/utils");
module.exports = new discord_kenway_handler_1.Comando({
    nombre: 'buscar',
    descripcion: 'buscar una canción por nombre, url o playlist url.',
    opciones: [
        { nombre: 'busqueda', descripcion: 'nombre, video url o playlist url de YouTube para reproducir.', requerido: true, tipo: 'cadena' },
        { nombre: 'rapido', descripcion: 'Tomar primera canción de la lista automáticamente.', tipo: 'booleano' }
    ],
    ejecutar: (client, interaction) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0;
        if (!interaction.guild || !interaction.guildId || !interaction.channel)
            return;
        const member = (0, utils_1.getMember)(client, interaction);
        if (!member.voice.channel)
            return interaction.reply({ embeds: [(0, UsualEmbeds_1.NoVoiceChannelEmbed)()] });
        const listener = (0, index_1.getMusicGuild)(interaction.guildId);
        if ((listener === null || listener === void 0 ? void 0 : listener.guild) && ((_a = listener === null || listener === void 0 ? void 0 : listener.voiceChannel) === null || _a === void 0 ? void 0 : _a.id) != member.voice.channelId)
            return interaction.editReply({ embeds: [(0, UsualEmbeds_1.NoSameVoiceChannelEmbed)()] });
        if ((listener === null || listener === void 0 ? void 0 : listener.guild) && ((_b = listener === null || listener === void 0 ? void 0 : listener.textChannel) === null || _b === void 0 ? void 0 : _b.id) != interaction.channelId)
            return interaction.editReply({ embeds: [(0, UsualEmbeds_1.NoSameTextChannelEmbed)()] });
        let fastSearch = (_c = interaction.options.getBoolean('rapido')) !== null && _c !== void 0 ? _c : false;
        const userSearch = interaction.options.getString('busqueda', true);
        if ((0, utils_1.isYoutubePlaylist)(userSearch)) {
            const playlistWindowConfim = new discord_kenway_handler_1.Ventana({
                titulo: 'AGREGAR PLAYLIST',
                id: 'command.search.window.playlist',
                componentes: [{
                        tipo: 'INPUT',
                        label: '¿Agregar PlayList? Podrá tomar tiempo.',
                        id: 'command.search.window.playlist.option',
                        estilo: 'CORTO',
                        largoMin: 6,
                        largoMax: 7,
                        placeholder: 'escribe: "aceptar" o "denegar"'
                    }]
            }).crear();
            yield interaction.showModal(playlistWindowConfim);
            const awaitModal = yield interaction.awaitModalSubmit({ time: 40000, filter: (x) => interaction.user.id == x.user.id }).catch(() => { });
            if (!awaitModal)
                return interaction.channel.send({ embeds: [{ title: `${Helpers_1.emojis.redCircle} | NO AGREGADO`, description: `No se ha agregado la PlayList de YouTube a la cola actual.`, color: 'RED' }] });
            const modalOptionSelected = awaitModal.fields.getTextInputValue('command.search.window.playlist.option').toLowerCase();
            if (!['aceptar', 'denegar'].includes(modalOptionSelected) || modalOptionSelected == 'denegar')
                return awaitModal.reply({ embeds: [{ title: `${Helpers_1.emojis.redCircle} | NO AGREGADO`, description: `No se ha agregado la PlayList de YouTube a la cola actual.`, color: 'RED' }] });
            awaitModal.reply({ embeds: [{ title: `${Helpers_1.emojis.orangeCircle} | INSERTANDO`, description: `Se está insertando la PlayList de YouTube, espera un momento, esto puede llevar un momento dependiendo de la cantidad de canciones en esta PlayList.`, footer: { text: 'Esto puede tomar unos segundos.' }, color: 'ORANGE' }] });
            const MusicConverted = yield (0, TransformYoutubePlaylist_1.default)(member, userSearch);
            if (!MusicConverted || MusicConverted.length == 0)
                return interaction.channel.send({ embeds: [{ title: `${Helpers_1.emojis.redCircle} | NO AGREGADO`, description: `No se ha agregado la PlayList porque ocurrió un error con la PlayList.`, color: 'RED' }] });
            return (0, addQueueOrPlaynow_1.default)({ type: 'playlist', interaction, musicInfo: MusicConverted });
        }
        ;
        yield interaction.reply({ embeds: [{ title: `${Helpers_1.emojis.mag} | Buscando...`, description: `Se está buscando tu canción, espera un momento...`, color: 'ORANGE' }] }).catch(() => { });
        if ((0, utils_1.isYoutubeURL)(userSearch) && !(0, utils_1.isYoutubePlaylist)(userSearch))
            fastSearch = true;
        const searchResult = yield (0, index_1.ytSearch)(userSearch);
        if (searchResult.length == 0)
            return interaction.editReply({ embeds: [(0, UsualEmbeds_1.NoSearchResultsEmbed)()] });
        const resultMap = searchResult.map((search, index) => index < 10 ? search : null).splice(0, 10);
        let musicInfo;
        if (!fastSearch) {
            const showResult = resultMap.map((result, index) => `**[${index + 1}]:** | [${result === null || result === void 0 ? void 0 : result.title}](${result === null || result === void 0 ? void 0 : result.url}) - [${result === null || result === void 0 ? void 0 : result.duration_raw}]`).join('\n');
            yield interaction.editReply({ embeds: [{ title: `${Helpers_1.emojis.blueCircle} | RESULTADOS`, description: `Se han encontrado varios resultados para tu búsqueda.\n**Escribe el número de la canción a agregar:**\n\n${showResult}`, color: 'BLUE' }] });
            const awaitMessage = yield ((_d = interaction === null || interaction === void 0 ? void 0 : interaction.channel) === null || _d === void 0 ? void 0 : _d.awaitMessages({ filter: (message) => interaction.user.id == message.author.id, time: 30000, errors: ['time'], max: 1 }));
            if (!awaitMessage)
                return interaction.editReply({ embeds: [{ title: `${Helpers_1.emojis.redCircle} | NO AGREGADO`, description: `No se ha agregado ningúna canción a la lista. No has escrito cual.` }] });
            const songNumber = parseInt((_f = (_e = awaitMessage === null || awaitMessage === void 0 ? void 0 : awaitMessage.first()) === null || _e === void 0 ? void 0 : _e.content) !== null && _f !== void 0 ? _f : 'NaN');
            if (isNaN(songNumber))
                return interaction.editReply({ embeds: [{ title: `${Helpers_1.emojis.redCircle} | NO AGREGADO`, description: `No se ha agregado ningúna canción a la lista. Has escrito un carácter no numérico.` }] });
            if (songNumber <= 0 || songNumber > 10)
                return interaction.editReply({ embeds: [{ title: `${Helpers_1.emojis.redCircle} | NO AGREGADO`, description: `No se ha agregado ningúna canción a la lista. El número ingresado es inválido.` }] });
            const songSelected = resultMap[songNumber - 1];
            musicInfo = {
                putBy: member,
                title: (_g = songSelected === null || songSelected === void 0 ? void 0 : songSelected.title) !== null && _g !== void 0 ? _g : '',
                description: (_h = songSelected === null || songSelected === void 0 ? void 0 : songSelected.description) !== null && _h !== void 0 ? _h : 'No Encontrada',
                duration: (_j = songSelected === null || songSelected === void 0 ? void 0 : songSelected.duration_raw) !== null && _j !== void 0 ? _j : '',
                thumbnail: (_k = songSelected === null || songSelected === void 0 ? void 0 : songSelected.snippet.thumbnails.url) !== null && _k !== void 0 ? _k : '',
                url: (_l = songSelected === null || songSelected === void 0 ? void 0 : songSelected.url) !== null && _l !== void 0 ? _l : '',
                views: (_m = songSelected === null || songSelected === void 0 ? void 0 : songSelected.views) !== null && _m !== void 0 ? _m : ''
            };
            (_o = awaitMessage === null || awaitMessage === void 0 ? void 0 : awaitMessage.first()) === null || _o === void 0 ? void 0 : _o.delete().catch(() => { });
        }
        else
            musicInfo = {
                putBy: member,
                title: (_q = (_p = resultMap[0]) === null || _p === void 0 ? void 0 : _p.title) !== null && _q !== void 0 ? _q : '',
                description: (_s = (_r = resultMap[0]) === null || _r === void 0 ? void 0 : _r.description) !== null && _s !== void 0 ? _s : 'No Encontrada',
                duration: (_u = (_t = resultMap[0]) === null || _t === void 0 ? void 0 : _t.duration_raw) !== null && _u !== void 0 ? _u : '',
                thumbnail: (_w = (_v = resultMap[0]) === null || _v === void 0 ? void 0 : _v.snippet.thumbnails.url) !== null && _w !== void 0 ? _w : '',
                url: (_y = (_x = resultMap[0]) === null || _x === void 0 ? void 0 : _x.url) !== null && _y !== void 0 ? _y : '',
                views: (_0 = (_z = resultMap[0]) === null || _z === void 0 ? void 0 : _z.views) !== null && _0 !== void 0 ? _0 : ''
            };
        interaction.deleteReply().catch(() => { });
        return (0, addQueueOrPlaynow_1.default)({ type: 'single-play', interaction, musicInfo });
    })
});
