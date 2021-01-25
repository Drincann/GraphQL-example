const data = {
    '1001': { username: '高厉害', age: 21 },
    '1002': { username: '列队猫', age: 90 },
    '1003': { username: '小明', age: 15 },
    '1004': { username: '小红', age: 16 },
}
module.exports = {
    findById(id) {
        if (id in data) {
            return data[id];
        }
        return null;
    }
}