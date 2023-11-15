/**
 * helper function to return list of all users that messages exist
 * @param {Array} messages 
 * @returns 
 */
const users = (messages) => {
    const result = [];
    for (let message of messages) {
        result.push(message.creatorId);
        result.push(message.recipientId);
    }
    return [...new Set(result)];
};

module.exports = users;