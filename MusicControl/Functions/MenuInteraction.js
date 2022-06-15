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
const Helpers_1 = require("../Embeds/Helpers");
const MediaPlayer_1 = require("../Media/MediaPlayer");
const MusicList_1 = require("../Media/MusicList");
const Searcher_1 = require("../Media/Searcher");
const addQueueOrPlaynow_1 = require("./addQueueOrPlaynow");
const TransformYoutubePlaylist_1 = require("./TransformYoutubePlaylist");
const utils_1 = require("./utils");
exports.default = (client, interaction) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!interaction.isSelectMenu())
        return;
    const listener = (0, MusicList_1.getMusicGuild)(interaction.guildId);
    const Menu = listener.menu.menu;
    const optionSelected = interaction.values[0];
    if (optionSelected == 'menu.selected.play') {
        if (listener.playingNow.isPaused) {
            interaction.deferUpdate();
            listener.playingNow.isPaused = false;
            listener.player.unpause();
            listener.menu.menu.updateMenu({ updateType: 'log', action: 'Ha despausado la reproducción', author: interaction.user });
            return;
        }
        ;
        const PlayWindow = new discord_kenway_handler_1.Ventana({
            id: 'menu.selected.start.play-window',
            titulo: 'Agregar Música',
            componentes: [
                {
                    id: 'menu.selected.start.play-window.input',
                    label: 'Nombre, URL Video/Playlist YouTube',
                    tipo: 'INPUT',
                    estilo: 'CORTO',
                    placeholder: 'https://www.youtube.com/... | tu cancion fav...',
                    requerido: true,
                    largoMin: 11,
                    largoMax: 100
                }
            ]
        }).crear();
        yield interaction.showModal(PlayWindow);
        const awaitWindow = yield interaction.awaitModalSubmit({ time: 40000, filter: (x) => x.guildId == listener.guild.id && x.customId == 'menu.selected.start.play-window' }).catch(() => { });
        if (!awaitWindow)
            return;
        const member = (0, utils_1.getMember)(client, interaction);
        const userSearch = awaitWindow.fields.getTextInputValue('menu.selected.start.play-window.input');
        awaitWindow.deferUpdate();
        if ((0, utils_1.isYoutubePlaylist)(userSearch)) {
            Menu.updateMenu({ updateType: 'notify', message: 'Se está agregando una playlist.' });
            const results = yield (0, TransformYoutubePlaylist_1.default)(interaction.user, userSearch);
            if (!results)
                return Menu.updateMenu({ updateType: 'notify', message: 'No se ha podido agregar la playlist solicitada.\nNo ha sido encontrado ningún resultado, ha fallado la búsqueda o los videos pueden contener restricciones.' });
            (0, addQueueOrPlaynow_1.default)({ type: 'playlist', interaction, musicInfo: results, notifyWithEmbed: false });
            Menu.updateMenu({ updateType: 'log', action: `Ha agregado una [playlist](${userSearch})\n`, author: interaction.user });
        }
        else {
            const results = yield (0, Searcher_1.ytSearch)(userSearch);
            if (!results || results.length < 1)
                return Menu.updateMenu({ updateType: 'notify', message: 'No se ha podido agregar la canción solicitada.\nNo ha sido encontrado ningún resultado o ha fallado la búsqueda.' });
            const musicInfo = {
                putBy: member,
                title: results[0].title,
                description: results[0].description,
                duration: results[0].duration_raw,
                thumbnail: results[0].snippet.thumbnails.url,
                url: results[0].url,
                views: results[0].views
            };
            (0, addQueueOrPlaynow_1.default)({ type: 'single-play', interaction, musicInfo, notifyWithEmbed: false });
            const musicInfoString = (0, utils_1.getMusicInfoStringify)(musicInfo, { omit: ['description', 'putBy'] });
            Menu.updateMenu({ updateType: 'log', action: `Ha agregado una canción:\n${musicInfoString}`, author: interaction.user });
        }
        ;
    }
    else if (optionSelected == 'menu.selected.pause') {
        interaction.deferUpdate();
        if (listener.playingNow.isPaused) {
            listener.playingNow.isPaused = false;
            listener.player.unpause();
            listener.menu.menu.updateMenu({ updateType: 'log', action: 'Ha pausado la reproducción', author: interaction.user });
        }
        else {
            listener.playingNow.isPaused = true;
            listener.player.pause();
            listener.menu.menu.updateMenu({ updateType: 'log', action: 'Ha despausado la reproducción', author: interaction.user });
        }
        ;
    }
    else if (optionSelected == 'menu.selected.stop') {
        Menu.ListPaginated.stopListen('manual');
        Menu.updateMenu({ updateType: 'notify', message: `La reproducción se ha detenido y la cola ha sido eliminada.` });
        Menu.updateMenu({ updateType: 'log', action: 'Ha detenido la reproducción eliminando la cola consigo.', author: interaction.user });
        (0, MediaPlayer_1.deleteConnection)(interaction.guildId, true);
        interaction.deferUpdate();
    }
    else if (optionSelected == 'menu.selected.prev') {
        if (!((_a = listener === null || listener === void 0 ? void 0 : listener.previousSong) === null || _a === void 0 ? void 0 : _a.url))
            return Menu.updateMenu({ updateType: 'notify', message: 'No se puede reproducir una canción anterior ya que es inexistente.' });
        listener.queue.push(listener.previousSong);
        listener.queue.push(listener.playingNow);
        const musicInfoString = (0, utils_1.getMusicInfoStringify)(listener.previousSong, { omit: ['description', 'putBy'] });
        Menu.updateMenu({ updateType: 'log', action: `Ha devuelvo a la canción anterior:\n${musicInfoString}`, author: interaction.user });
        (0, MediaPlayer_1.playSong)(interaction.guildId, 0);
        interaction.deferUpdate();
    }
    else if (optionSelected == 'menu.selected.next') {
        if (listener.queue.length < 1)
            return Menu.updateMenu({ updateType: 'notify', message: 'No se puede adelantar de canción ya que no hay música en cola.' });
        const musicInfoString = (0, utils_1.getMusicInfoStringify)(listener.queue[0], { omit: ['description', 'putBy'] });
        Menu.updateMenu({ updateType: 'log', action: `Ha avanzado a la siguiente canción:\n${musicInfoString}`, author: interaction.user });
        (0, MediaPlayer_1.playSong)(interaction.guildId, 0);
        interaction.deferUpdate();
    }
    else if (optionSelected == 'menu.selected.remove') {
        if (listener.queue.length < 1)
            return Menu.updateMenu({ updateType: 'notify', message: 'No hay música en la cola que pueda ser removida' });
        const RemoveWindow = new discord_kenway_handler_1.Ventana({
            titulo: 'Remover Música',
            id: 'menu.selected.remove.window',
            componentes: [
                {
                    id: 'menu.selected.remove.window.starts',
                    label: 'Iniciar eliminación en:',
                    tipo: 'INPUT',
                    estilo: 'CORTO',
                    largoMax: `${listener.queue.length}`.length,
                    placeholder: 'Número donde inicia la eliminación.',
                    requerido: true
                },
                {
                    id: 'menu.selected.remove.window.ends',
                    label: 'Terminar eliminación en:',
                    tipo: 'INPUT',
                    estilo: 'CORTO',
                    largoMax: `${listener.queue.length}`.length,
                    placeholder: 'Número donde terminará la eliminación (opcional).',
                    requerido: false
                }
            ]
        }).crear();
        interaction.showModal(RemoveWindow);
        const awaitWindow = yield interaction.awaitModalSubmit({ time: 40000, filter: (x) => x.guildId == listener.guild.id && x.customId == 'menu.selected.remove.window' }).catch(() => { });
        if (!awaitWindow)
            return;
        awaitWindow.deferUpdate();
        const startsDelete = parseInt(awaitWindow.fields.getTextInputValue('menu.selected.remove.window.starts'));
        const endsDelete = isNaN(parseInt(awaitWindow.fields.getTextInputValue('menu.selected.remove.window.ends'))) ? startsDelete : parseInt(awaitWindow.fields.getTextInputValue('menu.selected.remove.window.ends'));
        if (startsDelete < 0 || endsDelete < 0 || startsDelete == 0 || endsDelete == 0 || startsDelete > endsDelete)
            return Menu.updateMenu({ updateType: 'notify', message: `No se pudo eliminar música de la cola, se han ingresado parámetros inválidos.` });
        if (startsDelete > listener.queue.length)
            return Menu.updateMenu({ updateType: 'notify', message: 'No se pudo eliminar música de la lista: El número ingresado como inicio, supera el número en cola.' });
        if (endsDelete > listener.queue.length)
            return Menu.updateMenu({ updateType: 'notify', message: 'No se pudo eliminar música de la lista: El número ingresado como final, supera el número en cola.' });
        let removed = [];
        if (startsDelete === endsDelete)
            removed = listener.queue.splice(startsDelete - 1, 1);
        else
            removed = listener.queue.splice(startsDelete - 1, (endsDelete - startsDelete) + 1);
        return Menu.updateMenu({ updateType: 'log', action: `Ha eliminado ${removed.length} cancion(es) de la cola.`, author: interaction.user });
    }
    else if (optionSelected == 'menu.selected.repeat') {
        if (listener.repeat == 'disabled') {
            Menu.updateMenu({ updateType: 'log', action: `${Helpers_1.emojis.repeatOne} Ha activado el repetir una vez la canción actual.`, author: interaction.user });
            listener.repeat = 'one-time';
        }
        else if (listener.repeat == 'one-time') {
            Menu.updateMenu({ updateType: 'log', action: `${Helpers_1.emojis.infinity} Ha activado el repetir infinitamente la canción actual.`, author: interaction.user });
            listener.repeat = 'infinity';
        }
        else if (listener.repeat == 'infinity') {
            Menu.updateMenu({ updateType: 'log', action: `Ha desactivado el repetir la canción actual.`, author: interaction.user });
            listener.repeat = 'disabled';
        }
        ;
        interaction.deferUpdate();
    }
    else if (optionSelected == 'menu.selected.restart') {
        interaction.deferUpdate();
        const musicInfoString = (0, utils_1.getMusicInfoStringify)(listener.playingNow, { omit: ['putBy', 'description'] });
        Menu.updateMenu({ updateType: 'log', action: `Ha reiniciado la canción actual:\n${musicInfoString}`, author: interaction.user });
        return (0, MediaPlayer_1.restartSong)(interaction.guildId);
    }
    else if (optionSelected == 'menu.selected.close') {
        Menu.updateMenu({ updateType: 'log', action: `Ha cerrado el menú multimedia.`, author: interaction.user });
        Menu.updateMenu({ updateType: 'notify', message: 'Se ha cerrado el menú multimedia, vuelve a usar el comando para abrir el menú nuevamente.' });
        Menu.ListPaginated.stopListen('manual');
        listener.menu.isStart = false;
        listener.menu.menu = {};
        interaction.deferUpdate();
    }
    ;
});
