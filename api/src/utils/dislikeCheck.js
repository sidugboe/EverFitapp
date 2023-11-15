/**
 * helper function to see if a user has disliked a post and gets likes count
 * !! mutually exclusive with likeCount !!
 * @param {*} postObject 
 * @param {*} userObject userId of user making the call
 * @returns 
 */
const count = (postObject, userObject) => {

    postObject.likeCount = postObject.likes ? postObject.likes.length : 0;
    postObject.dislikeCount = postObject.dislikes ? postObject.dislikes.length : 0;

    const index = postObject.dislikes?.find(u => u._id == userObject._id);

    if (!index) delete postObject.dislikes;
    else postObject.dislikes = [userObject];

    return postObject;
};

module.exports = count;