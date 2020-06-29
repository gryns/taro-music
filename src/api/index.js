import request from "./request"

// 根据歌手名字查询
export const searchMusic = name => request(`/search?keywords=${name}`, {}, "GET");

// 获取歌曲 MP3
export const getPlayMp3 = id => request(`/song/url?id=${id}`, {}, "GET");

// 获取详情
export const musicDetail = id => request(`/detail?ids=${id}`, {}, "GET");

// 获取歌词
export const getMusicLyric = id => request(`/lyric?id=${id}`, {}, "GET");