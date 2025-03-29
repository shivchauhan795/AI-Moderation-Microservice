import Like from "./assets/Like"
import Comment from "./assets/Comment"
import Close from "./assets/Close"
import { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
function App() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
  const [openCommentBox, setopenCommentBox] = useState(false);
  const [posts, setPosts] = useState<any>([]);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const commentRef = useRef<HTMLInputElement>(null);

  async function fetchPosts() {
    try {
      const posts = await fetch(`${backendUrl}/posts`, {
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

    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  async function handleAddComment() {
    try {
      console.log("inside comment handle function", commentRef, selectedPost.id);
      const response = await fetch(`${backendUrl}/comment`, {
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
      console.log(data);
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
  return (
    <div className="flex flex-col justify-center items-center">
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
      <h1 className="text-3xl font-bold uppercase pt-3">
        Posts
      </h1>

      <div className="h-fit w-1/3 p-5 rounded-2xl flex flex-col justify-center items-center self-center mb-10 gap-10">
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
                <button className="cursor-pointer">{Like()}</button>
                <div>0</div>
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
              <button onClick={() => { handleAddComment() }} className="bg-green-400 text-black border-2 cursor-pointer rounded-md px-2 py-1">Submit</button>
            </div>
          </div>
        </div>
      }
    </div>
  )
}

export default App
