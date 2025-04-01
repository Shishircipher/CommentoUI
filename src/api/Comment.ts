// export function createConnection({ serverUrl, postId })  {
//     // A real implementation would actually connect to the server
//     return {
//       connect() {
//         console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
//       },
//       disconnect() {
//         console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
//       }
//     };
//   }

// export async function createConnection({ serverUrl, postId }: { serverUrl: string; postId: number }) {
//     try {
//         const response = await fetch(`${serverUrl}/comments?postId=${postId}`);
//         if (!response.ok) {
//             throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
//         }
//         const data = await response.json();
//         return data;
//     } catch (error) {
//         console.error("Error fetching comments:", error);
//         return null;
//     }
// }

// fetchComments: async (postId: number, parentId: number | null = null) => {
//     try {
//       const url = parentId
//         ? `${serverUrl}/replies/${postId}/${parentId}` // Fetch replies
//         : `${serverUrl}/comments?postId=${postId}`; // Fetch top-level comments
  
//       const response = await fetch(url);
//       if (!response.ok) throw new Error("Failed to fetch comments");
//       const data: Comment[] = await response.json();
  
//       // 🔄 Recursively fetch replies for each comment
//       for (const comment of data) {
//         comment.replies = await createConnection({ serverUrl, postId }).fetchComments(postId, comment.id);
//       }
  
//       return data;
//     } catch (error) {
//       console.error(error);
//       return [];
//     }
//   }
  
export async function getComments({ serverUrl, postId, parentId }: { serverUrl: string; postId: number; parentId: number | null  }) {
    try {
        const url = parentId
                ? `${serverUrl}/comments/${postId}/${parentId}` // Fetch replies
                : `${serverUrl}/comments/${postId}`;
                //  : `${serverUrl}/comments?postId=${postId}`; // Fetch top-level comments
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log(data)
        return data;
    } catch (error) {
        console.error("Error fetching comments:", error);
        return " we are sorry - comments could not loaded";
    }
}
interface User {
    name: string;
    email: string;
    picture: string;
  }


export async function postComments({ serverUrl, postId, parentId , user, content  }: { serverUrl: string; postId: number; parentId: number | null ; user: User | null, content : string  }) {
    try {
        const url = `${serverUrl}/comments`
        // Todo : it should have type , i think in typescript 
        const postComment = {
            "author" : user,
            "post_id" : postId,
            "parent_id" : parentId,
            "content" : content,
        }
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(postComment),
            // ...
          });
        if (!response.ok) {
            throw new Error(`Failed to post comment: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Error fetching comments:", error);
        return " we are sorry - comments could not posted";
    }



}

// const options = {
//      serverUrl: 'http://localhost:8000',
//      postId : 1,
//      parentId : null,
//      user :  {
//         "name" : "raman",
//         "email" : "raman0121@example.com",
//         "picture" : "http://raman.example.com"
//     },
//     content : "This is raman comment"
   
    
//   };




// // Use an async function to test it properly
// async function test() {
//     const data = await postComments(options);
//      console.log(data);
//  }

// test(); // Call the async function


// const options = {
//     serverUrl: '',
//     postId : 1,
//     parentId : null
//   };

// const data = createConnection(options)

// console.log(data)
// Use an async function to test it properly
// async function test() {
//     const data = await createConnection(options);
//     console.log(data);
// }

// test(); // Call the async function