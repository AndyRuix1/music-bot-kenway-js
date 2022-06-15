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
const MusicList_1 = require("../Media/MusicList");
class default_1 {
    constructor(props) {
        var _a, _b, _c;
        this.listen = () => __awaiter(this, void 0, void 0, function* () {
            const embed = this._createListEmbed();
            if (this.MusicPages.length > 1 || this.realTimeEver) {
                const { ButtonGroup } = this._createNavigationButtons();
                ButtonGroup.components[1].setDisabled(true);
                ButtonGroup.components[2].setDisabled(true);
                this.message = yield this.channel.send({ embeds: [embed], components: [ButtonGroup] });
                this._createListen(embed);
                return;
            }
            ;
            this.message = yield this.channel.send({ embeds: [embed] });
        });
        this.stopListen = (reason) => {
            this.ButtonCollector.stop(reason);
        };
        this._getPage = (page) => this.MusicPages[page].map((music, i) => `**[${(page * 10) + i + 1}]:** [${music.title}](${music.url}) - ${music.duration}`).join('\n');
        this._createListen = (embed) => {
            const ButtonCollector = this.message.createMessageComponentCollector({ filter: this.filter, time: this.time > 0 ? this.time : undefined, componentType: 'BUTTON' });
            this.ButtonCollector = ButtonCollector;
            let pageSelected = 1;
            const { ButtonGroup } = this._createNavigationButtons();
            const autoUpdate = {
                interval: setInterval(() => {
                    this.MusicPages = this._createListArray();
                    if (!this.MusicPages[pageSelected - 1])
                        pageSelected = this.MusicPages.length;
                    const listener = (0, MusicList_1.getMusicGuild)(this.guildId);
                    if (!(listener === null || listener === void 0 ? void 0 : listener.guild))
                        return this.stopListen('Finalización de reproducción');
                    if (pageSelected == this.MusicPages.length)
                        ButtonGroup.components[2].setDisabled(true); //next button
                    if (pageSelected < this.MusicPages.length)
                        ButtonGroup.components[2].setDisabled(false); //next button
                    if (pageSelected == 1)
                        ButtonGroup.components[1].setDisabled(true); //Back Button
                    if (pageSelected > 1)
                        ButtonGroup.components[1].setDisabled(false); //Back Button
                    const updateEmbed = this._createListEmbed(pageSelected - 1);
                    this.message.edit({ embeds: [updateEmbed], components: [ButtonGroup] }).catch(() => { });
                }, 1500),
                isActive: false
            };
            autoUpdate.interval;
            autoUpdate.isActive = true;
            ButtonCollector.on('collect', (interaction) => __awaiter(this, void 0, void 0, function* () {
                if (this.resetAuto)
                    ButtonCollector.resetTimer();
                if (interaction.customId == 'list.paginated.navigation.stop') {
                    ButtonCollector.stop('manual');
                    return;
                }
                ;
                if (interaction.customId == 'list.paginated.navigation.back') { //Back page
                    pageSelected -= 1;
                    if (pageSelected < this.MusicPages.length)
                        ButtonGroup.components[2].setDisabled(false); //next button
                    if (pageSelected == 1)
                        ButtonGroup.components[1].setDisabled(true);
                    const embed = this._createListEmbed(pageSelected - 1);
                    interaction.update({ embeds: [embed], components: [ButtonGroup] }).catch(() => ButtonCollector.stop('error'));
                    return;
                }
                ;
                if (interaction.customId == 'list.paginated.navigation.next') { //Next Page
                    pageSelected += 1;
                    if (pageSelected > 1)
                        ButtonGroup.components[1].setDisabled(false);
                    if (pageSelected == this.MusicPages.length)
                        ButtonGroup.components[2].setDisabled(true); //next button
                    const embed = this._createListEmbed(pageSelected - 1);
                    interaction.update({ embeds: [embed], components: [ButtonGroup] }).catch(() => ButtonCollector.stop('error'));
                    return;
                }
                ;
            }));
            ButtonCollector.on('end', (collected, reason) => {
                clearInterval(autoUpdate.interval);
                autoUpdate.isActive = false;
                if (reason == 'manual') {
                    embed.setDescription(`La lista se ha cerrado correctamente. Puedes volver a abrirla utilizando el comando nuevamente.`)
                        .setFooter({ text: 'Paginación no disponible' });
                }
                else if (reason == 'time') {
                    embed.setDescription(`La lista se ha cerrado automáticamente, se consideró inactividad.`)
                        .setFooter({ text: 'Paginación no disponible.' });
                }
                else if (reason == 'error') {
                    embed.setDescription(`La lista se ha cerrado automáticamente, ha ocurrido un error con las páginas.`)
                        .setFooter({ text: 'Paginación no disponible' });
                }
                else {
                    embed.setDescription(reason !== null && reason !== void 0 ? reason : 'desconocido')
                        .setFooter({ text: 'Paginación no disponible' });
                }
                ;
                this.message.edit({ embeds: [embed], components: [] }).catch(() => { });
            });
        };
        this._createNavigationButtons = () => {
            const ButtonGroup = new discord_kenway_handler_1.MessageActionRow();
            const StopButton = new discord_kenway_handler_1.MessageButton()
                .setEmoji(Helpers_1.emojis.redCircle)
                .setCustomId('list.paginated.navigation.stop')
                .setStyle('DANGER')
                .setLabel('Detener Navegación');
            const BackButton = new discord_kenway_handler_1.MessageButton()
                .setEmoji(Helpers_1.emojis.leftArrow)
                .setCustomId('list.paginated.navigation.back')
                .setStyle('PRIMARY')
                .setLabel('Atrás');
            const NextButton = new discord_kenway_handler_1.MessageButton()
                .setEmoji(Helpers_1.emojis.rightArrow)
                .setCustomId('list.paginated.navigation.next')
                .setStyle('PRIMARY')
                .setLabel('Siguiente');
            if (this.isMenuFunction)
                StopButton.setDisabled(true);
            ButtonGroup.addComponents(StopButton, BackButton, NextButton);
            return { ButtonGroup, StopButton, BackButton, NextButton };
        };
        this._createListEmbed = (exactPage) => {
            const listener = this._getGuildListener();
            exactPage = exactPage !== null && exactPage !== void 0 ? exactPage : 0;
            const playingNow = listener.playingNow.isPlaying ? `**Título:** [${listener.playingNow.title}](${listener.playingNow.url})\n**Duración:** ${listener.playingNow.duration}\n**Puesto por:** ${listener.playingNow.putBy}\n**Vistas:** ${listener.playingNow.views}` : 'Ningúna canción en reproducción';
            const pageInfo = this._getPage(exactPage);
            const ListEmbed = new discord_kenway_handler_1.MessageEmbed()
                .setTitle(`${Helpers_1.emojis.notes} | LISTA MUSICAL`)
                .setDescription(pageInfo)
                .addField(`${Helpers_1.emojis.play} | REPRODUCIENDO AHORA`, playingNow, true)
                .setColor('GREEN')
                .setTimestamp();
            this.MusicPages.length > 1 ? ListEmbed.setFooter({ text: `Página: ${exactPage + 1}/${this.MusicPages.length} | ${listener.queue.length} cancion(es) en cola. ` }) : ListEmbed.setFooter({ text: `Sin paginación disponible` });
            return ListEmbed;
        };
        this._createListArray = () => {
            const listener = this._getGuildListener();
            if (!(listener === null || listener === void 0 ? void 0 : listener.queue)) {
                this.stopListen('Error en reproducción');
                return this.MusicPages;
            }
            ;
            this.MusicPages = [];
            if (listener.queue.length <= 10) {
                this.MusicPages.push([...listener.queue]);
                return this.MusicPages;
            }
            ;
            this.MusicPages.push(new Array());
            const readyInyected = [];
            const startInyection = () => {
                const lastElement = this.MusicPages[this.MusicPages.length - 1];
                for (var i in listener.queue) {
                    if (readyInyected.some(inyected => inyected.url == listener.queue[i].url))
                        continue;
                    lastElement.push(listener.queue[i]);
                    readyInyected.push(listener.queue[i]);
                    if (lastElement.length >= 10 && readyInyected.length < listener.queue.length) {
                        this.MusicPages.push(new Array());
                        return startInyection();
                    }
                    ;
                }
                ;
            };
            startInyection();
            return this.MusicPages;
        };
        this.channel = props.channel;
        this.guildId = props.guildId;
        this.time = props.time;
        this.filter = props.filter;
        this.MusicPages = [];
        this.MusicPages = this._createListArray();
        this.resetAuto = (_a = props === null || props === void 0 ? void 0 : props.resetAuto) !== null && _a !== void 0 ? _a : false;
        this.realTimeEver = (_b = props.realTimeEver) !== null && _b !== void 0 ? _b : false;
        this.isMenuFunction = (_c = props.isMenuFunction) !== null && _c !== void 0 ? _c : false;
        this.message = {};
        this.ButtonCollector = {};
    }
    ;
    _getGuildListener() {
        const listener = MusicList_1.MusicList.find(listen => listen.guild.id == this.guildId);
        if (!listener)
            return {};
        return listener;
    }
    ;
}
exports.default = default_1;
;
;
