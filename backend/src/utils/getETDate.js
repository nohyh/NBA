/**
 * 获取 NBA 比赛日期
 * 从 Python 同步脚本保存的 JSON 文件读取
 */
const fs = require('fs');
const path = require('path');

const getETDate = () => {
    try {
        const dateFile = path.join(__dirname, '../../data/nba_date.json');
        const data = JSON.parse(fs.readFileSync(dateFile, 'utf-8'));
        return new Date(data.date + 'T00:00:00Z');
    } catch (error) {
        // 如果文件不存在，使用备用计算方法
        console.warn('无法读取 NBA 日期文件，使用备用计算');
        const now = new Date();
        now.setHours(now.getHours() - 15);
        const dateStr = now.toISOString().split('T')[0];
        return new Date(dateStr + 'T00:00:00');
    }
};

module.exports = getETDate;
