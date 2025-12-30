const fs = require("fs");
const path = require("path");

const pad2 = (value) => String(value).padStart(2, "0");

const formatLocalDateString = (date = new Date()) => {
    return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
};

const getETDate = () => {
    try {
        const dateFile = path.join(__dirname, "../../data/nba_date.json");
        const data = JSON.parse(fs.readFileSync(dateFile, "utf-8"));
        if (data?.date) {
            return data.date;
        }
    } catch (error) {
        console.warn("Failed to read nba_date.json, falling back to local date.");
    }
    return formatLocalDateString();
};

module.exports = getETDate;
