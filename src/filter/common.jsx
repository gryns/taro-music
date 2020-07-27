/**
 * 转换时间 分：秒
 *@param mill : 秒
 * **/
export const transTime = (mill) => {
    // 转换为 秒
    const transSecond = mill / 1000
    let second = parseInt(transSecond % 60)
    second = second > 10 ? second : "0" + second
    let minute = parseInt(transSecond / 60)
    minute = minute > 10 ? minute : "0" + minute

    return `${minute}:${second}`
}

/**
 * 歌词进度 秒 转换
 * @param second
 * **/
export const transSecond = second => {
    // 分
    let minute = parseInt(second / 60)
    minute = '0' + minute
    // 秒
    let mill = parseInt(second % 60)
    mill = mill < 10 ? '0' + mill : mill
    return `${minute}:${mill}`
}
