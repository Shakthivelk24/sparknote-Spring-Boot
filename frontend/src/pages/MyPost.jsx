import {
  useContext,
  useEffect,
  useState
} from "react";

import {
  userDataContext
} from "../context/DataContext.jsx";

import axios from "axios";

import UserPost from "../components/UserPost";


export default function MyPost() {

  const {
    serverUrl
  } = useContext(userDataContext);

  const [posts, setPosts] = useState([]);

  const [loading, setLoading] =
    useState(true);


  // ========================================
  // FETCH USER POSTS
  // ========================================

  useEffect(() => {

    const fetchUserPosts = async () => {

      try {

        setLoading(true);

        const url =
          `${serverUrl}/api/posts/user`;

        console.log(
          "Fetching user posts:",
          url
        );

        const res = await axios.get(
          url,
          {
            withCredentials: true
          }
        );

        console.log(
          "User posts response:",
          res.data
        );

        setPosts(
          Array.isArray(res.data)
            ? res.data
            : []
        );

      } catch (error) {

        console.error(
          "Error loading user posts:",
          error.response?.status,
          error.response?.data ||
          error.message
        );

        setPosts([]);

      } finally {

        setLoading(false);

      }
    };


    // IMPORTANT:
    // Do not check:
    // if (serverUrl)
    //
    // serverUrl is "" in Docker.
    // The request should still be made to:
    // /api/posts/user

    fetchUserPosts();

  }, [serverUrl]);


  // ========================================
  // LOADING
  // ========================================

  if (loading) {

    return (

      <p className="text-center mt-5">
        Loading...
      </p>

    );

  }


  // ========================================
  // POSTS
  // ========================================

  return (

    <div className="p-5">

      {posts.length > 0 ? (

        posts.map((post) => (

          <UserPost
            key={post.id}
            post={post}
            setPost={setPosts}
          />

        ))

      ) : (

        <p className="text-center">
          No posts found.
        </p>

      )}

    </div>

  );

}