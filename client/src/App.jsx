import React, { useEffect, useState } from "react";
import sendIcon from "./assets/send.svg";
import userIcon from "./assets/user.png";
import loaderIcon from "./assets/loader.svg";
import botIcon from "./assets/bot.png";
import axios from "axios";
function App() {
  // let arr=[
  //   {type: "user",post:"Hey"},
  //   {type: "bot",post:"Welcome to ChatGPT - 3.5"},
  // ]

  const [input, setInput] = useState("");
  const [posts, setPosts] = useState([]);

  useEffect(()=>{
    document.querySelector(".layout").scrollTop=document.querySelector(".layout").scrollHeight;
  },[posts]);
  const fetchBotResponse = async () => {
    const { data } = await axios.post(
      "http://localhost:4000",
      { input },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return data;
  };

  const onSubmit = () => {
    if (input.trim() === "") return;
    updatePosts(input);
    updatePosts("loading",false,true)
    setInput("");
    fetchBotResponse().then((res)=>{
      console.log(res);
      updatePosts(res.bot.trim(),true);
    })
  };

  const autoTypingBotResponse=(text)=>{
    let index=0;
    let interval=setInterval(()=>{
      if(index<text.length)
      {
        setPosts((prevState)=>{
          let lastItem=prevState.pop();
          if(lastItem.type!=="bot")
          {
            prevState.push({
              type:"bot",
              post:text.charAt(index-1)
            })
          }
          else{
            prevState.push({
              type:"bot",
              post:lastItem.post + text.charAt(index-1)
            })
          }
          return [...prevState];
        });
        index++;
      }
      else{
        clearInterval(interval);
      }
    },30)
  }
  const updatePosts = (post,isBot,isLoading) => {
    if(isBot)
    {
      autoTypingBotResponse(post);
    }
    else{
      setPosts((prevState) => {
        return [...prevState, { type: isLoading? "loading": "user", post }];
      });
    }
  };  

  const onKeyEnter = (e) => {
    if (e.key === "Enter" || e.which === 13) {
      onSubmit();
    }
  };
  return (
    <>
      <main className="chatGPT-app">
        <section className="chat-container">
          <div className="layout">
            {posts.map((post, index) => (
              <div
                key={index}
                className={`chat-bubble ${
                  post.type === "bot" || post.type === "loading" ? "bot" : ""
                }`}
              >
                <div className="avatar">
                  <img
                    src={
                      post.type === "bot" || post.type === "loading"
                        ? botIcon
                        : userIcon
                    }
                  />
                </div>
                {post.type === "loading" ? (
                  <div className="loading">
                  </div>
                ) : (
                  <div className="post">{post.post}</div>
                )}
              </div>
            ))}
          </div>
        </section>
        <footer>
          <input
            className="composebar"
            autoFocus
            type="text"
            value={input}
            placeholder="Ask anything"
            onChange={(e) => setInput(e.target.value)}
            onKeyUp={onKeyEnter}
          />
          <div className="send-button" onClick={onSubmit}>
            <img src={sendIcon} />
          </div>
        </footer>
      </main>
    </>
  );
}

export default App;
