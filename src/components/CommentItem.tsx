import { useState, useEffect, useRef } from 'react';
import { getComments, postComments } from '../api/Comment'
import { useAuth } from './AuthContext';
interface Comment {
    id: number;
    content: string;
    author: {
      name: string;
      picture: string;
    };
  }
interface CommentItemProps {
//   comment: { id: number; content: string };
  comment : Comment;
  postId: number;
}

const serverUrl = 'http://localhost:8000';
interface PublicAuthor {
  name : string,
  picture : string
}
export function CommentItem({ comment, postId }: CommentItemProps) {
  const { user, login } = useAuth(); // Get the logged-in user
  const [replies, setReplies] = useState<{ id: number; content: string; author : PublicAuthor }[]>([]);
  const [loading, setLoading] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [showReplyInput, setShowReplyInput] = useState(false);
  
  const commentRef = useRef<HTMLDivElement>(null);

  // Load replies when comment is scrolled into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (entry.isIntersecting && !showReplies) {
          setLoading(true);
          const options = { serverUrl, postId, parentId: comment.id };
          const data = await getComments(options);
          if (data) setReplies(data);
          setShowReplies(true);
          setLoading(false);
        }
      },
      { threshold: 0.1 } // Trigger when 10% of comment is visible
    );

    if (commentRef.current) observer.observe(commentRef.current);

    return () => {
      if (commentRef.current) observer.unobserve(commentRef.current);
    };
  }, [comment.id, postId, showReplies]);

  async function handleReplySubmit() {
    if (!replyText.trim()) return;

    if (!user) {
      alert("You need to be logged in to reply.");
      return;
    }

    setLoading(true);

    const options = {
      serverUrl,
      postId,
      parentId: comment.id,
      user,
      content: replyText
    };

    try {
      const data = await postComments(options);
      if (data) {
        setReplies(prevReplies => [...prevReplies, data]); // Append new reply
        setReplyText('');
        setShowReplyInput(false);

        // Fetch updated replies
        const updatedReplies = await getComments({ serverUrl, postId, parentId: comment.id });
        if (updatedReplies) setReplies(updatedReplies);
      }
    } catch (error) {
      console.error("Failed to post comment:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div ref={commentRef} style={{ marginLeft: '20px', borderLeft: '2px solid #ddd', paddingLeft: '10px' }}>
      <p>{comment.content}</p>
      <p> {comment.id}</p>
      <img
        // className="avatar"
        src={comment.author.picture}
        alt={'Photo of ' + comment.author.name}
        style={{
          width: 16,
          height: 16
        }}
      />
      <p> {comment.author.name}</p>
  

      {loading && <p>Loading replies...</p>}

      {showReplies && replies.length === 0 && <p>No replies yet.</p>}

      {showReplies && (
        <ul>
          {replies.map(reply => (
            <CommentItem key={reply.id} comment={reply} postId={postId} />
          ))}
        </ul>
      )}

      {!showReplyInput && (
        <button onClick={() => setShowReplyInput(true)}>Reply</button>
      )}

      {!user && showReplyInput && (
        <button onClick={login}>Login with Google</button>
      )}

      {user && showReplyInput && (
        <div>
          <input
            type="text"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write a reply..."
          />
          <button onClick={handleReplySubmit}>Send</button>
        </div>
      )}
    </div>
  );
}
