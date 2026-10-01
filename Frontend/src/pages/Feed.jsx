
import React, { useState, useEffect } from "react"
import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL

const Feed = () => {
    const user = JSON.parse(localStorage.getItem("user"))

    const [posts, setPosts] = useState([])
    const [editingId, setEditingId] = useState(null)
    const [editedCaption, setEditedCaption] = useState("")

    const [commentText, setCommentText] = useState({})
    const [comments, setComments] = useState({})

    const [editingCommentId, setEditingCommentId] = useState(null)
    const [editedCommentText, setEditedCommentText] = useState("")

    // ================= GET POSTS AND COMMENTS =================

    useEffect(() => {
        const fetchPostsAndComments = async () => {
            try {
                const postResponse = await axios.get(
                    `${API_URL}/posts`
                )

                const postsData = postResponse.data.posts
                setPosts(postsData)

                const commentsData = {}

                for (const post of postsData) {
                    const commentResponse = await axios.get(
                        `${API_URL}/comments/${post._id}`
                    )

                    commentsData[post._id] = commentResponse.data
                }

                setComments(commentsData)
            } catch (err) {
                console.error(err)
            }
        }

        fetchPostsAndComments()
    }, [])

    // ================= DELETE POST =================

    const handleDelete = async (id) => {
        try {
            await axios.delete(
                `${API_URL}/posts/${id}`,
                {
                    data: {
                        username: user.username
                    }
                }
            )

            setPosts((prevPosts) =>
                prevPosts.filter((post) => post._id !== id)
            )
        } catch (err) {
            console.error(err)
            alert("Error deleting post")
        }
    }

    // ================= EDIT CAPTION =================

    const handleEdit = async (id) => {
        try {
            const res = await axios.put(
                `${API_URL}/posts/${id}`,
                {
                    caption: editedCaption,
                    username: user.username
                }
            )

            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post._id === id
                        ? {
                            ...post,
                            caption: res.data.post.caption
                        }
                        : post
                )
            )

            setEditingId(null)
            setEditedCaption("")
        } catch (err) {
            console.error(err)
            alert("Error updating post")
        }
    }

    // ================= DELETE CAPTION =================

    const handleDeleteCaption = async (id) => {
        try {
            const res = await axios.delete(
                `${API_URL}/posts/${id}/caption`,
                {
                    data: {
                        username: user.username
                    }
                }
            )

            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post._id === id
                        ? {
                            ...post,
                            caption: res.data.post.caption
                        }
                        : post
                )
            )
        } catch (err) {
            console.error(err)
            alert("Error deleting caption")
        }
    }

    // ================= LIKE / UNLIKE =================

    const handleLike = async (id) => {
        if (!user) {
            alert("Please login to like a post")
            return
        }

        try {
            const res = await axios.put(
                `${API_URL}/posts/${id}/like`,
                {
                    username: user.username
                }
            )

            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post._id === id
                        ? res.data.post
                        : post
                )
            )
        } catch (err) {
            console.error("Like error:", err.response?.data || err.message)
            alert("Error liking post")
        }
    }

    // ================= SAVE / UNSAVE =================

    const handleSave = async (id) => {
        if (!user) {
            alert("Please login to save a post")
            return
        }

        try {
            const res = await axios.put(
                `${API_URL}/posts/${id}/save`,
                {
                    username: user.username
                }
            )

            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post._id === id
                        ? res.data.post
                        : post
                )
            )
        } catch (err) {
            console.error(err)
            alert("Error saving post")
        }
    }

    // ================= ADD COMMENT =================

    const handleComment = async (postId) => {
        try {
            if (!user) {
                alert("Please login to comment")
                return
            }

            const text = commentText[postId]

            if (!text || text.trim() === "") {
                return
            }

            const res = await axios.post(
                `${API_URL}/comments`,
                {
                    postId: postId,
                    text: text,
                    username: user.username
                }
            )

            setComments((prevComments) => ({
                ...prevComments,
                [postId]: [
                    ...(prevComments[postId] || []),
                    res.data.comment
                ]
            }))

            setCommentText((prevText) => ({
                ...prevText,
                [postId]: ""
            }))
        } catch (err) {
            console.error(err)
            alert("Error adding comment")
        }
    }

    // ================= DELETE COMMENT =================

    const handleDeleteComment = async (commentId, postId) => {
        try {
            await axios.delete(
                `${API_URL}/comments/${commentId}`,
                {
                    data: {
                        username: user.username
                    }
                }
            )

            setComments((prevComments) => ({
                ...prevComments,
                [postId]: (prevComments[postId] || []).filter(
                    (comment) => comment._id !== commentId
                )
            }))
        } catch (err) {
            console.error(err)
            alert("Error deleting comment")
        }
    }

    // ================= EDIT COMMENT =================

    const handleEditComment = async (commentId, postId) => {
        try {
            const res = await axios.put(
                `${API_URL}/comments/${commentId}`,
                {
                    text: editedCommentText,
                    username: user.username
                }
            )

            setComments((prevComments) => ({
                ...prevComments,
                [postId]: (prevComments[postId] || []).map((comment) =>
                    comment._id === commentId
                        ? res.data.comment
                        : comment
                )
            }))

            setEditingCommentId(null)
            setEditedCommentText("")
        } catch (err) {
            console.error(err)
            alert("Error updating comment")
        }
    }

    // ================= UI =================

    return (
        <section className="feed-section">
            {posts.length > 0 ? (
                posts.map((post) => (
                    <div
                        key={post._id}
                        className="post-card"
                    >
                        {/* IMAGE */}

                        <div className="image-container">
                            <img
                                src={post.image}
                                alt={post.caption}
                            />

                            {user && user.username === post.username && (
                                <button
                                    className="delete-image-btn"
                                    onClick={() => handleDelete(post._id)}
                                >
                                    🗑️
                                </button>
                            )}
                        </div>

                        {/* CAPTION */}

                        {editingId === post._id ? (
                            <div>
                                <input
                                    type="text"
                                    value={editedCaption}
                                    onChange={(e) =>
                                        setEditedCaption(e.target.value)
                                    }
                                />

                                <button
                                    onClick={() => handleEdit(post._id)}
                                >
                                    Save
                                </button>

                                <button
                                    onClick={() => {
                                        setEditingId(null)
                                        setEditedCaption("")
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <div>
                                <span>{post.caption}</span>

                                {user && user.username === post.username && (
                                    <>
                                        <button
                                            onClick={() => {
                                                setEditingId(post._id)
                                                setEditedCaption(post.caption)
                                            }}
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() =>
                                                handleDeleteCaption(post._id)
                                            }
                                        >
                                            Delete
                                        </button>
                                    </>
                                )}
                            </div>
                        )}

                        {/* LIKE / UNLIKE */}

                        <button
                            onClick={() => handleLike(post._id)}
                        >
                            {user && post.likedBy?.includes(user.username)
                                ? "❤️"
                                : "🤍"}
                            {" "}
                            {post.likes}
                        </button>

                        {/* COMMENTS INPUT */}

                        <div>
                            <input
                                type="text"
                                placeholder="Write a comment..."
                                value={commentText[post._id] || ""}
                                onChange={(e) =>
                                    setCommentText((prevText) => ({
                                        ...prevText,
                                        [post._id]: e.target.value
                                    }))
                                }
                            />

                            <button
                                onClick={() => handleComment(post._id)}
                            >
                                Comment
                            </button>
                        </div>

                        {/* DISPLAY COMMENTS */}

                        <div>
                            {comments[post._id]?.map((comment) => (
                                <div key={comment._id}>
                                    {editingCommentId === comment._id ? (
                                        <div>
                                            <input
                                                type="text"
                                                value={editedCommentText}
                                                onChange={(e) =>
                                                    setEditedCommentText(e.target.value)
                                                }
                                            />

                                            <button
                                                onClick={() =>
                                                    handleEditComment(
                                                        comment._id,
                                                        post._id
                                                    )
                                                }
                                            >
                                                Save
                                            </button>

                                            <button
                                                onClick={() => {
                                                    setEditingCommentId(null)
                                                    setEditedCommentText("")
                                                }}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <p>
                                            💬 <strong>{comment.username}</strong>: {comment.text}
                                        </p>
                                    )}

                                    {user && user.username === comment.username && (
                                        <>
                                            <button
                                                onClick={() => {
                                                    setEditingCommentId(comment._id)
                                                    setEditedCommentText(comment.text)
                                                }}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                onClick={() =>
                                                    handleDeleteComment(
                                                        comment._id,
                                                        post._id
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            ) : (
                <p>No posts available.</p>
            )}
        </section>
    )
}

export default Feed