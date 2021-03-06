import React, { useEffect } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import { useDispatch, useSelector } from "react-redux";
import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { CommentsBlock } from '../components/CommentsBlock';
import { fetchPosts, fetchTags } from '../redux/slices/posts';
import { useParams } from 'react-router-dom';

export const Home = () => {
  const params = useParams();
  console.log(params)
  const dispatch = useDispatch();
  const userData = useSelector( state => state.auth.data);
  const { posts, tags } = useSelector(state => state.posts)
  const isPostsLoading = posts.status === "loading";
  const isTagsLoading = tags.status === "loading";

  useEffect(() => {
    dispatch(fetchPosts(params.tag));
    dispatch(fetchTags());
  }, [params.tag])

  if(!isPostsLoading){
    console.log(posts.items[0])
  }

  return (
    <>
      <Tabs style={{ marginBottom: 15 }} value={0} aria-label="basic tabs example">
        <Tab label="Новые" />
        <Tab label="Популярные" />
      </Tabs>
      <Grid container spacing={4}>
        <Grid xs={8} item>
          {(isPostsLoading ? [...Array(5)] : posts.items).map((post, index) => 
            isPostsLoading ? <Post key={index} isLoading={true} /> :
              <Post 
                key={index}
                isLoading={false}
                _id={post._id}
                title={post.title}
                imageUrl={post.imageUrl}
                viewsCount={post.viewsCount}
                user={{
                  avatarUrl: post.user.avatarUrl,
                  fullName: post.user.fullName
                }}
                createdAt={ post.createdAt }
                commentsCount={post.commentsCount}
                tags={post.tags}
                isEditable={userData?._id === post.user._id}
                />
          )}
        </Grid>
        <Grid xs={4} item>
          <TagsBlock items={tags.items} isLoading={isTagsLoading} />
        </Grid>
      </Grid>
    </>
  );
};
