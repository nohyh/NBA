/**
 * 获取美国东部时间的日期
 * @returns {Date} 美东时间的今天日期（时间为 00:00:00）
 */
const getETDate = () => {
    const now = new Date();
    // NBA 的"比赛日"通常比实际日期晚一点
    // 用更大的偏移确保匹配 NBA API 的日期
    now.setHours(now.getHours() - 15);

    // 返回只有日期部分的 Date 对象
    const dateStr = now.toISOString().split('T')[0];
    return new Date(dateStr + 'T00:00:00.000Z');
};

module.exports = getETDate;
