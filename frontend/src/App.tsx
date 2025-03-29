import Like from "./assets/Like"
import Comment from "./assets/Comment"
import Close from "./assets/Close"
import { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
function App() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
  const [openCommentBox, setopenCommentBox] = useState(false);
  const [openCreatePost, setopenCreatePost] = useState(false);
  const [posts, setPosts] = useState<any>([]);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const commentRef = useRef<HTMLInputElement>(null);
  const createPostRef = useRef<HTMLInputElement>(null);
  const [loading, setloading] = useState(true);

  async function fetchPosts() {
    try {
      const posts = await fetch(`${backendUrl}/api/v1/users/posts`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `${localStorage.getItem("moderator_token")}`
        },
      });
      const data = await posts.json();
      console.log(data);
      console.log(data.posts);
      setPosts(data.posts);
      setloading(false);

    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  async function handleCreatePost() {
    try {
      await fetch(`${backendUrl}/api/v1/users/post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `${localStorage.getItem("moderator_token")}`
        },
        body: JSON.stringify({
          content: createPostRef.current?.value,
        })
      });

      toast.success("Post created successfully!");

      fetchPosts();
      setopenCreatePost(false);
    } catch (e) {
      console.log(e);
    }
  }

  async function handleLike(postId: any) {
    try {
      const response = await fetch(`${backendUrl}/api/v1/users/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `${localStorage.getItem("moderator_token")}`
        },
        body: JSON.stringify({
          postId
        })
      });
      const data = await response.json();


      toast.success(data.message);

      fetchPosts();
      setopenCommentBox(false);
    } catch (e) {
      console.log(e);
    }
  }
  async function handleAddComment() {
    try {
      const response = await fetch(`${backendUrl}/api/v1/users/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `${localStorage.getItem("moderator_token")}`
        },
        body: JSON.stringify({
          content: commentRef.current?.value,
          postId: selectedPost.id
        })
      });
      const data = await response.json();

      if (data.message === "Comment flagged for moderation!") {
        toast.error("Comment flagged for moderation!");
      } else {
        toast.success("Comment added successfully!");
      }
      fetchPosts();
      setopenCommentBox(false);
    } catch (e) {
      console.log(e);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-black"></div> {/* Loading spinner */}
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
      <h1 className="text-3xl font-bold uppercase pt-3 fixed top-0">
        Posts
      </h1>
      <button onClick={() => { setopenCreatePost(true) }} className="border px-2 py-1 fixed right-25 top-0 mr-3 mt-3 rounded bg-green-600 font-semibold uppercase cursor-pointer">Create Post</button>
      <button onClick={() => { localStorage.removeItem("moderator_token"); window.location.reload() }} className="border px-2 py-1 fixed right-0 top-0 mr-3 mt-3 rounded bg-red-400 font-semibold uppercase cursor-pointer">Logout</button>
      <div className="h-fit w-1/3 p-5 rounded-2xl flex flex-col justify-center items-center self-center mt-20 mb-10 gap-10">
        {posts.map((post: any) => (
          <div key={post.id} className="w-96 flex flex-col h-fit bg-green-300 shadow-2xl border-2 justify-center items-center rounded-md py-3">
            <div className="text-sm font-semibold flex self-start px-3 py-1 uppercase">
              {post.user.name}
            </div>
            <div className="flex p-2">
              {post.content}
            </div>
            <div className="flex gap-5 pt-3">
              <div className="flex gap-2">
                <button onClick={() => {
                  handleLike(post.id);
                }} className="cursor-pointer">{Like()}</button>
                <div>{post.likes?.length || 0}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => {
                  setopenCommentBox(true);
                  setSelectedPost(post);
                }}
                  className="cursor-pointer">{Comment()}
                </button>
                <div>{post.comments.length}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* comment dialog box */}
      {openCreatePost &&
        <div className="bg-black/70 w-screen h-screen fixed top-0 flex justify-center items-center">
          <div className="flex flex-col items-center w-96 h-fit pb-5 bg-white rounded-lg">
            <div className="flex self-end mr-3 mt-1 cursor-pointer w-fit border" onClick={() => {
              setopenCreatePost(false);
            }}>
              {Close()}
            </div>
            <div className="flex font-semibold text-xl pt-3">
              Create Post
            </div>

            <div className="w-full p-5">
              <input ref={createPostRef} className="border-2 border-black rounded-md px-2 py-1 w-full" type="text" placeholder="Post Content" />
            </div>
            <div>
              <button onClick={() => { handleCreatePost() }} className="bg-green-400 text-black border-2 cursor-pointer rounded-md px-2 py-1">Create Post</button>
            </div>
          </div>
        </div>
      }
      {openCommentBox &&
        <div className="bg-black/70 w-screen h-screen fixed top-0 flex justify-center items-center">
          <div className="flex flex-col items-center w-96 h-fit pb-5 bg-white rounded-lg">
            <div className="flex self-end mr-3 mt-1 cursor-pointer w-fit border" onClick={() => {
              setopenCommentBox(false);
            }}>
              {Close()}
            </div>
            <div className="flex font-semibold text-xl pt-3">
              Add Comment
            </div>
            <div className=" p-5 w-full h-52 overflow-y-auto flex flex-col gap-2">
              {selectedPost.comments && selectedPost.comments.length > 0 ? (
                selectedPost.comments.map((comment: any) => (
                  <div key={comment.id} className={`flex flex-col h-fit ${comment.flaged === true ? "bg-red-300" : "bg-green-300"}  justify-center items-center rounded-md py-3`}>
                    <div className="text-sm font-semibold self-start px-3 py-1 uppercase">
                      {comment.user?.name || `User ${comment.userId}`}
                    </div>
                    <div className="flex p-5">{comment.flaged ? "This comment is flagged for moderation!" : comment.content}</div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center">No comments yet.</p>
              )}
            </div>
            <div className="w-full p-5">
              <input ref={commentRef} className="border-2 border-black rounded-md px-2 py-1 w-full" type="text" placeholder="Comment" />
            </div>
            <div>
              <button onClick={() => { handleAddComment() }} className="bg-green-400 text-black border-2 cursor-pointer rounded-md px-2 py-1">Add Comment</button>
            </div>
          </div>
        </div>
      }
    </div>
  )
}

export default App
