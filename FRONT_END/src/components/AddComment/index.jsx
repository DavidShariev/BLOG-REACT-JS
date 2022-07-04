import React, { useState } from "react";

import styles from "./AddComment.module.scss";

import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { selectIsAuth } from "../../redux/slices/auth";
import { useSelector } from "react-redux";
import axios from '../../axios';
import { useNavigate, useParams } from "react-router-dom";

export const Index = ({comments, setComments}) => {
  const navigate = useNavigate();
  const params = useParams();
  const isAuth = useSelector(selectIsAuth);
  const [text, setText] = useState("");
  const userData = useSelector( state => state.auth.data);

  if(!isAuth){
    return (
      <></>
    )
  }

  const createComment = async () => {
    await axios.post("/comment/add", {
      text,
      postId: params.id
    }).then((res) => {
      setText("");
      res.data.user = userData;
      const comList = [...comments, res.data];
      setComments(comList);
    })
  }

  return (
    <>
      <div className={styles.root}>
        <Avatar
          classes={{ root: styles.avatar }}
          src={userData.avatarUrl}
        />
        <div className={styles.form}>
          <TextField
            label="Написать комментарий"
            variant="outlined"
            maxRows={10}
            multiline
            fullWidth
            value={text}
            onChange={(e) => {setText(e.target.value)}}
          />
          <Button variant="contained" onClick={createComment}>Отправить</Button>
        </div>
      </div>
    </>
  );
};
