
import './App.css'
import { AuthProvider } from './components/AuthContext';
import { CommentBox } from './components/CommentBox';

function App() {
  
    return (
      <>
       
        {/* <CommentBox postId={1} /> */}
        <AuthProvider>
        <CommentBox postId={1} />
        </AuthProvider>
      </>
    );
  }
 
  
  export default App
