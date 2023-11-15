import React, { useState, useEffect } from 'react';
import { View } from 'recat-native';
import { usePostTags } from '../../../services/usePostTags';
import { Feed } from '../Feed';
import { BackOnlyHeader } from '../../../components/appbars/backOnlyHeader'
import { ExplorePageSkeleton } from '../../../components/skeletons/ExplorePageSkeleton';

const TopicPosts = ({ navigation, route }) => {
    const tag = route?.params?.tag;
    const [postsLoaded, setPostsLoaded] = useState(false)
    const [posts, setPosts] = useState([])

    // hook to access post tags
    const { getPostsByTag } = usePostTags();

    // get posts associated with tag immeditely on render
    useEffect(() => {

        const loadPosts = async () => {
            
            let posts = await getPostsByTag(tag);

            if(posts?.length)
                setPosts(posts);
            else
                setPosts([])
            setPostsLoaded(true)
        }

        if(!postsLoaded)
            loadPosts();
    }, [])

    return (
        <>
            <BackOnlyHeader navigation={navigation} centerText={"Topic: " + tag}/>
            { postsLoaded ? 
                <Feed navigation={navigation} posts={posts}/>
                :
                <ExplorePageSkeleton/>
            }
            
        </>
    )
}

export { TopicPosts }