import request from './request'

// banber 接口 发现音乐
/**
 * type : 0:pc , 1:android , 2: iphone , 3: ipad
 * **/
export const ApiBannerData = (params) => request('/banner', params, 'GET')

// 最新歌曲
export const newSongData = () => request('/personalized/newsong', {}, 'GET')

// 推荐音乐
/**
 * limit : 默认 30
 * offset
 * **/
export const recommendSong = (params) => request('/personalized', params, 'GET')

/**
 * 最新音乐
 * @params type : 0 全部 、1 话语、96 欧美 、 8 日本 、16 韩国
 * **/
export const newestSong = (params) => request('/top/song', params, 'GET')

// 根据歌手名字查询
export const searchMusic = (params) => request(`/search`, params, 'GET')

// 获取歌曲 MP3
export const getPlayMp3 = (id) => request(`/song/url?id=${id}`, {}, 'GET')

// 获取详情
export const musicDetail = (id) => request(`/detail?ids=${id}`, {}, 'GET')

// 获取歌词
export const getMusicLyric = (id) => request(`/lyric?id=${id}`, {}, 'GET')
