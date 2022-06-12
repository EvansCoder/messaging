import { useState, useEffect } from "react";
import Head from "next/head";
import { db } from "../firebase";
import { AiOutlineDelete } from "react-icons/ai";
import Avatar from "react-avatar";
import {
  collection,
  getDocs,
  serverTimestamp,
  addDoc,
  deleteDoc,
  doc,
  orderBy,
  query
} from "firebase/firestore";

const Post = () => {
  const [posts, setPosts] = useState([]);
  const [input, setInput] = useState("");
  const timestamp = serverTimestamp();
  const q = query(collection(db, "posts"), orderBy("timestamp","desc"));

  useEffect(() => {
    const getPost = async () => {
      const data = await getDocs(collection(db, "posts"),q);
      setPosts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getPost();
  }, [posts]);

  const sendPost = async () => {
    if (input.trim() === "") {
      alert("Please enter a message");
      return;
    }
    await addDoc(collection(db, "posts"), {
      username: "Wanga Evans",
      description: "Senior Developer",
      message: input,
      timestamp: timestamp,
    });
    setInput("");
  };
  const deletePost = async (id) => {
    await deleteDoc(doc(db, "posts", id))
      .then(() => {
        console.log("Post deleted successfully");
      })
      .catch((error) => {
        alert(error.message);
      });
  };
  return (
    <div>
      <Head>
        <title>posts</title>
      </Head>
      <div className="bg-gray-100 w-screen h-fit">
        <div className="p-20 ">
          <h1 className="text-4xl text-blue-600 font-extrabold">
            Creating Posts with Firebase
          </h1>
          <div className="container w-40 h-fit bg-gray-100">
            <div className="flex items-center border-2 rounded-full bg-white min-w-fit pr-10 pl-2 py-4 my-4 ">
              <input
                onChange={(e) => setInput(e.target.value)}
                type="text"
                placeholder="Type here your message"
                className="bg-transparent outline-none ml-5"
              />
              <button type="submit" onClick={sendPost} className="flex">
                <p className="text-white ">Pos</p>
                <img
                  className="w-8 h-6"
                  src="https://cdn-icons-png.flaticon.com/512/561/561226.png"
                  alt=""
                />
              </button>
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-600">
                Recent Posts
              </h1>
              <div>
                {posts.map((post) => {
                  return (
                    <div className="post w-85 py-8 h-fit bg-white rounded text-gray-500 my-5 px-10">
                      <div className="flex">
                        <Avatar
                          src="https://scontent.fmba3-1.fna.fbcdn.net/v/t1.6435-9/126051899_1081478718969173_4431334387308704236_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=m8O4yybMp08AX-_53IV&_nc_ht=scontent.fmba3-1.fna&oh=00_AT-qk_ofjKKscKL_gZnEY7YlWggbYtF-ndQTqSLzo5f4zg&oe=62C76180"
                          size="50"
                          round={true}
                          className="mr-5"
                        />
                        <div className="flex flex-col">
                          <h1 className="text-2xl font-semibold">
                            {post.username}
                          </h1>
                          <p className="text-gray-400 mb-4">
                            {post.description}
                          </p>
                        </div>
                      </div>
                      <p>{post.message}</p>

                      <button
                        className="rounded-full text-red-400 hover:text-red-600  px-2 text-2xl flex justify-end w-full"
                        type="submit"
                        onClick={() => {
                          deletePost(post.id);
                        }}
                      >
                        <AiOutlineDelete />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
