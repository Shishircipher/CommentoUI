import { useState, useEffect } from 'react';
import { getComments } from '../api/Comment.js';
import { CommentItem } from './CommentItem';
import { useAuth } from './AuthContext';

const serverUrl = import.meta.env.VITE_SERVER_URL
interface Comment {
  id: number;
  content: string;
  author: {
    name: string;
    picture: string;
  };
}

export function CommentBox({ postId }: { postId: number }) {
  const { user, login, logout } = useAuth();
  // const [comments, setComments] = useState<{ id: number; content: string }[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    async function fetchComments() {
      setLoading(true);
      setError(null); // Reset error on new fetch attempt
      const options = { serverUrl, postId, parentId: null };
      const data = await getComments(options);

      if (typeof data === 'string') {
        setError(data); // If an error message is returned
      } else {
        setComments(data);
      }

      setLoading(false);
    }
    
    fetchComments();
  }, [postId]);

  return (
    <div>
      <h1>Comments for Post {postId}</h1>

      {/* Login / Logout */}
      {user ? (
        <div>
          <p>Logged in as {user.name}</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <button onClick={login}>Login with Google</button>
      )}

      {loading && <p>Loading comments...</p>}

      {!loading && error && <p>{error}</p>}

      {!loading && !error && comments.length === 0 && <p>No comments yet.</p>}

      {!loading && !error && (
        <ul>
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} postId={postId} />
          ))}
        </ul>
      )}
    </div>
  );
}