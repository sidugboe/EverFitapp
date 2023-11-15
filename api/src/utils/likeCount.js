/**
 * helper function to get like count of post
 * @param {*} postObject 
 * @returns 
 */
const count = postObject => {
    postObject.likeCount = postObject.likes ? postObject.likes.length : 0;
    postObject.dislikeCount = postObject.dislikes ? postObject.dislikes.length : 0;

    delete postObject.dislikes;

    return postObject;
};

module.exports = count;