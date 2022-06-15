"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMusicInfoStringify = exports.getMusicDescription = exports.getMember = exports.isYoutubePlaylist = exports.isYoutubeURL = void 0;
const isYoutubeURL = (textContent) => /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/gi.test(textContent);
exports.isYoutubeURL = isYoutubeURL;
const isYoutubePlaylist = (textContent) => /^.*(youtu.be\/|list=)([^#\&\?]*).*/gi.test(textContent);
exports.isYoutubePlaylist = isYoutubePlaylist;
const getMember = (client, interaction) => client.guilds.cache.get(interaction.guild.id).members.cache.get(interaction.user.id);
exports.getMember = getMember;
const getMusicDescription = (music) => {
    if (music.description.length < 1)
        return '';
    const musicDescription = `**Descripción:** ${music.description.length > 1200 ? music.description.slice(0, 1200).concat(' ...') : music.description}`;
    return musicDescription;
};
exports.getMusicDescription = getMusicDescription;
const getMusicInfoStringify = (musicInfo, options) => {
    let musicInfoStringify = '';
    const musicInfoObj = {
        titulo: `**Título:** [${musicInfo.title}](${musicInfo.url})`,
        descripcion: (0, exports.getMusicDescription)(musicInfo),
        duration: `**Duración:** ${musicInfo.duration}`,
        vistas: `**Vistas:** ${musicInfo.views}`,
        putBy: `**Ingresada por:** ${musicInfo.putBy}`,
    };
    const musicInfoKeys = Object.keys(musicInfoObj);
    for (var i in musicInfoKeys) {
        if (!(options === null || options === void 0 ? void 0 : options.omit) || options.omit.length < 1) {
            musicInfoStringify += `${musicInfoObj[musicInfoKeys[i]]}\n`;
            continue;
        }
        ;
        if (musicInfoKeys[i] == 'titulo' && !options.omit.includes('title'))
            musicInfoStringify += `${musicInfoObj[musicInfoKeys[i]]}\n`;
        if (musicInfoKeys[i] == 'description' && !options.omit.includes('description'))
            musicInfoStringify += `${musicInfoObj[musicInfoKeys[i]]}\n`;
        if (musicInfoKeys[i] == 'duration' && !options.omit.includes('duration'))
            musicInfoStringify += `${musicInfoObj[musicInfoKeys[i]]}\n`;
        if (musicInfoKeys[i] == 'vistas' && !options.omit.includes('views'))
            musicInfoStringify += `${musicInfoObj[musicInfoKeys[i]]}\n`;
        if (musicInfoKeys[i] == 'putBy' && !options.omit.includes('putBy'))
            musicInfoStringify += `${musicInfoObj[musicInfoKeys[i]]}\n`;
    }
    ;
    return musicInfoStringify;
};
exports.getMusicInfoStringify = getMusicInfoStringify;
