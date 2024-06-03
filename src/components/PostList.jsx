import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`/api/users/posts?page=${page}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPosts((prevPosts) => [...prevPosts, ...res.data]);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPosts();
  }, [page]);

  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Posts</h1>
      <div className="grid grid-cols-1 gap-4">
        {posts.map((post) => (
          <div key={post._id} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>
            <p className="text-gray-700">{post.content}</p>
            <div className="mt-4 text-sm text-gray-500">
              By {post.author.username} on {new Date(post.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
      {loading && <div className="text-center mt-4">Loading...</div>}
    </div>
  );
};

export default PostList;
