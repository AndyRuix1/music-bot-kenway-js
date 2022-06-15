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
const usetube_1 = require("usetube");
const Searcher_1 = require("../Media/Searcher");
exports.default = (user, playlistUrl) => __awaiter(void 0, void 0, void 0, function* () {
    const getYoutubeId = require('get-youtube-playlist-id');
    const MusicConverted = [];
    return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
        const playlistId = getYoutubeId(playlistUrl);
        const playlistVideos = yield (0, usetube_1.getPlaylistVideos)(playlistId);
        if (playlistVideos.length == 0)
            return resolve(false);
        for (var i in playlistVideos) {
            const video = playlistVideos[i];
            const searchOriginalVideo = yield (0, Searcher_1.ytSearch)(video.original_title);
            if (!searchOriginalVideo[0])
                continue;
            const videoInfo = searchOriginalVideo[0];
            MusicConverted.push({
                description: videoInfo.description,
                duration: videoInfo.duration_raw,
                thumbnail: videoInfo.snippet.thumbnails.url,
                title: videoInfo.title,
                url: videoInfo.url,
                views: videoInfo.views,
                putBy: user
            });
        }
        ;
        return resolve(MusicConverted);
    }));
});
