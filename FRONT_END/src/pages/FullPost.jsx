import React from "react";

import { Post } from "../components/Post";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";
import ReactMarkdown from "react-markdown";
import { useParams } from "react-router-dom";
import axios from "../axios";
import { useEffect } from "react";

export const FullPost = () => {
  const params = useParams();

  const [data, setData] = React.useState();
  const [comments, setComments] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(true);
  
  useEffect(() => {
    axios.get(`/comment/${params.id}`).then( res => {
      setComments(res.data);
      console.log(comments);
    })
    axios.post(`/posts/${params.id}`).then( res => {
      setData(res.data);
      setIsLoading(false);
    }).catch(err => {
      console.warn(err);
      alert("Post loading error");
    })
  }, [])

  if(isLoading){
    return <Post isLoading={isLoading} />
  }

  return (
    <>
      <Post
        id={data.id}
        title={data.title}
        imageUrl={data.imageUrl}
        user={{
          avatarUrl:
            data.user.avatarUrl,
          fullName: data.user.fullName,
        }}
        createdAt={data.createdAt}
        viewsCount={data.viewsCount}
        commentsCount={comments.length}
        tags={data.tags}
        isFullPost
      >
        <ReactMarkdown children={data.text} />
      </Post>
      <CommentsBlock
        items={comments}
        isLoading={comments === []}
      >
        <Index comments={comments} setComments={setComments}/>
      </CommentsBlock>
    </>
  );
};
