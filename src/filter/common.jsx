/**
 * 转换时间 分：秒
 *@params second : 秒
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