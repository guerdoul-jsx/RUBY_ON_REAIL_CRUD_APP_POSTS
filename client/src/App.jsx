import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import PostList from "./components/PostList";

const INITIAL_STATE = {
  title: "",
  body: "",
};

function App() {
  const [postForm, setPostForm] = useState(INITIAL_STATE);
  const [posts, setPosts] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [idToUpdate, setIdToUpdate] = useState(null);

  const [loading, setIsLoading] = useState(false);

  const { title, body } = postForm;

  const handlechange = (event) => {
    const { name, value } = event.target;
    setPostForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    (async () => {
      const response = await fetch("http://127.0.0.1:3000/posts");
      const data = await response.json();
      setPosts(data);
    })();
  }, []);

  const handleCreate = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    if (!title | !body) {
      toast.error("All field Are Required");
      setIsLoading(false);
      return;
    }
    try {
      const response = await fetch("http://127.0.0.1:3000/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title,
          body: body,
        }),
      });

      const data = await response.json();
      setPosts((prev) => [...prev, data]);

      toast.success("Post Has Been Created SuccessFully");
      setPostForm(INITIAL_STATE);
    } catch (error) {
      console.log("ERROR COMMING FROM CREATING POST", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    await fetch(`http://127.0.0.1:3000/posts/${id}`, {
      method: "DELETE",
    });

    setPosts((prev) => prev.filter((post) => post.id !== id));
    toast.success("Post deleted SuccessFully");
  };

  const handleEdit = (id) => {
    setIsEdit(true);
    setPostForm(posts.filter((post) => post.id === id)[0]);
    setIdToUpdate(id);
  };

  const handleUpdate = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `http://127.0.0.1:3000/posts/${idToUpdate}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: title,
            body: body,
          }),
        }
      );

      const data = await response.json();
      setPosts((prev) => prev.filter((post) => post.id !== idToUpdate));
      setPosts((prev) => [...prev, data]);
      setPostForm(INITIAL_STATE);
      toast.success("Post Has Been Updated SuccessFully");
    } catch (error) {
      console.log("ERROR COMMING FROM CREATING POST", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto w-[500px] mt-20 border border-1 shadow-md rounded-md">
      <form
        className="grid w-full grid-cols-1 p-4 gap-y-3"
        onSubmit={handleCreate}
      >
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-white">Posts App</h2>
          <hr className="my-4" />
        </div>
        <div className="flex flex-col space-y-3">
          <label htmlFor="title" className="font-semibold text-white">
            Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            className="input input-bordered"
            value={title}
            onChange={handlechange}
          />
        </div>
        <div className="flex flex-col space-y-3">
          <label htmlFor="body" className="font-semibold text-white">
            Description
          </label>
          <input
            type="text"
            name="body"
            id="body"
            className="input input-bordered"
            value={body}
            onChange={handlechange}
          />
        </div>
        <div className="flex items-center justify-end">
          {isEdit ? (
            <button
              className="bg-orange-500 border-none btn"
              type="button"
              onClick={() => handleUpdate()}
            >
              {loading ? "Updating..." : "Update"}
            </button>
          ) : (
            <button className="bg-green-600 border-none btn" type="submit">
              {loading ? "Creating..." : "Create"}
            </button>
          )}
        </div>
      </form>
      <div className="px-4 my-4">
        <div className="flex flex-col space-y-4">
          {posts.map((post, index) => (
            <div
              tabIndex={0}
              className="border collapse collapse-arrow border-base-300 bg-base-200"
              key={index}
            >
              <div className="flex items-center justify-between text-xl font-medium collapse-title">
                {post.title}{" "}
                <div>
                  <button
                    className="bg-red-600 btn btn-xs"
                    onClick={() => handleDelete(post.id)}
                  >
                    delete
                  </button>
                  <button
                    className="bg-orange-400 btn btn-xs"
                    onClick={() => handleEdit(post.id)}
                  >
                    edit
                  </button>
                </div>
              </div>
              <div className="collapse-content">
                <p>{post.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
