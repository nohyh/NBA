const prisma = require('../utils/prisma');
const getNews = async (req, res) => {
    try {
        const news = await prisma.news.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            take: 20
        })
        return res.status(200).json({ news })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error })
    }
}
module.exports = { getNews }