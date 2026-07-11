import fs from "fs";

const DATABASE = "database.json";

let data = {
    users: [],
    listings: [],
    borrows: [],
    next_uid: 1,
    next_lid: 1,
    next_bid: 1,
}

function loadData() {
    if (fs.existsSync(DATABASE)) {
        const fileData = String(fs.readFileSync(DATABASE));
        data = JSON.parse(fileData);
    }
}

loadData();

export function saveData() {
    fs.writeFileSync(DATABASE, JSON.stringify(data));
}

export function getData() {
    return data;
}