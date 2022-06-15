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
exports.Menu = void 0;
const discord_kenway_handler_1 = require("discord-kenway-handler");
const Helpers_1 = require("../Embeds/Helpers");
const MusicList_1 = require("../Media/MusicList");
const CreateListPaginated_1 = require("./CreateListPaginated");
const getMember = (client, interaction) => client.guilds.cache.get(interaction.guild.id).members.cache.get(interaction.user.id);
;
class Menu {
    constructor(props) {
        this.runFirstTime = () => __awaiter(this, void 0, void 0, function* () {
            const listener = (0, MusicList_1.getMusicGuild)(this.guildId);
            const SelectMenu = new discord_kenway_handler_1.MessageActionRow()
                .addComponents(new discord_kenway_handler_1.MessageSelectMenu()
                .setCustomId('menu.selected')
                .setMaxValues(1)
                .setMinValues(1)
                .setPlaceholder(`${Helpers_1.emojis.musicalNote}  MENÚ`)
                .addOptions([
                {
                    value: 'menu.selected.play',
                    emoji: Helpers_1.emojis.play,
                    label: `Reproducir`,
                    description: 'Agregar nueva canción a la cola.'
                },
                {
                    value: 'menu.selected.pause',
                    emoji: Helpers_1.emojis.pause,
                    label: 'Pausar',
                    description: 'Pausar o despausar la canción actual.'
                },
                {
                    value: 'menu.selected.stop',
                    emoji: Helpers_1.emojis.stop,
                    label: 'Detener',
                    description: 'Detener música y eliminar cola. (se cerrará el menú)'
                },
                {
                    value: 'menu.selected.prev',
                    emoji: Helpers_1.emojis.previous,
                    label: 'Anterior',
                    description: `Reproducir la cancion anterior.`
                },
                {
                    value: 'menu.selected.next',
                    emoji: Helpers_1.emojis.skip,
                    label: 'Siguiente',
                    description: 'Reproducir la siguiente canción'
                },
                {
                    value: 'menu.selected.remove',
                    emoji: Helpers_1.emojis.pin,
                    label: 'Remover',
                    description: 'Remover una o más canciones de la lista.'
                },
                {
                    value: 'menu.selected.repeat',
                    emoji: Helpers_1.emojis.repeat,
                    label: 'Repetir',
                    description: 'Activar/Desactivar repetir una o más veces una canción.'
                },
                {
                    value: 'menu.selected.restart',
                    emoji: Helpers_1.emojis.restart,
                    label: 'Reiniciar',
                    description: 'Reiniciar canción sonando.'
                },
                {
                    value: 'menu.selected.close',
                    emoji: Helpers_1.emojis.redCircle,
                    label: 'Cerrar Menú',
                    description: 'Cerrar menú y usar la reproducción normal.'
                }
            ]));
            const embed = this.Embed();
            const List = new CreateListPaginated_1.default({
                channel: listener.textChannel,
                filter: (btn) => {
                    var _a;
                    const member = getMember(MusicList_1.globalClient, btn);
                    if (((_a = member === null || member === void 0 ? void 0 : member.voice) === null || _a === void 0 ? void 0 : _a.channel) && member.voice.channelId == listener.voiceChannel.id)
                        return true;
                },
                guildId: this.guildId,
                time: 0,
                resetAuto: false,
                realTimeEver: true,
                isMenuFunction: true
            });
            List.listen();
            this.ListPaginated = List;
            const message = yield listener.textChannel.send({ embeds: [embed], components: [SelectMenu] }).catch(() => { return {}; });
            if (!(message === null || message === void 0 ? void 0 : message.author))
                return false;
            this.message = message;
            this.listOpen = true;
            return true;
        });
        this.updateMenu = (props) => {
            const updateType = props.updateType;
            if (this.notifications.length >= 5)
                this.notifications.pop();
            if (this.actionLog.length >= 5)
                this.actionLog.pop();
            if (updateType == 'log') {
                const { action, author } = props;
                this.actionLog.unshift({ author, action });
            }
            else if (updateType == 'notify') {
                const { message } = props;
                this.notifications.unshift({ message });
            }
            ;
            this.message.edit({ embeds: [this.Embed()] });
        };
        this.Embed = () => {
            var _a;
            const listener = (0, MusicList_1.getMusicGuild)(this.guildId);
            const Menu = new discord_kenway_handler_1.MessageEmbed()
                .setTitle(`${Helpers_1.emojis.beg} | MENÚ`)
                .setAuthor({ iconURL: (_a = MusicList_1.globalClient.user.avatarURL()) !== null && _a !== void 0 ? _a : '', name: MusicList_1.globalClient.user.username })
                .setThumbnail(listener.playingNow.thumbnail)
                .addField(`${Helpers_1.emojis.scroll} | ÚLTIMAS ACCIONES`, this.actionLog.length > 0 ? this.actionLog.map((x, i) => `_[${i + 1}]:_ ${x.author}: ${x.action}`).join('\n') : 'Sin acciones registradas.', true)
                .addField(`${Helpers_1.emojis.bell} | NOTIFICACIONES`, this.notifications.length > 0 ? this.notifications.map((x, i) => `_[${i + 1}]:_ ${x.message}`).join('\n') : 'Sin notificaciones registradas', true)
                .setColor('RANDOM')
                .setTimestamp()
                .setFooter({ text: `${listener.queue.length} Cancion(es) en cola` });
            return Menu;
        };
        this.guildId = props.guildId;
        this.listOpen = false;
        this.ListPaginated = {};
        this.notifications = [];
        this.message = {};
        this.actionLog = new Array();
        const listener = (0, MusicList_1.getMusicGuild)(this.guildId);
        this.runFirstTime().then(messageSend => {
            if (!messageSend)
                listener.textChannel.send({ embeds: [{ title: `${Helpers_1.emojis.redCircle} | MENÚ NO ABIERTO`, description: `Ha ocurrido un error al abrir el menú. Intenta nuevamente.`, color: 'RED' }] });
        });
    }
    ;
}
exports.Menu = Menu;
;
