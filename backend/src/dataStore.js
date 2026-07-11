import fs from "fs";

const DATABASE = "database.json";

let data = {
    users: [],
    currentUser: null,
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

    data.users ??= [];
    data.currentUser ??= null;
    data.listings ??= [];
    data.borrows ??= [];
    data.next_uid ??= 1;
    data.next_lid ??= 1;
    data.next_bid ??= 1;
}

loadData();

export function saveData() {
    fs.writeFileSync(DATABASE, JSON.stringify(data));
}

export function getData() {
    return data;
}