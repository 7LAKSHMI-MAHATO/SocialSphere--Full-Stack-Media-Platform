import React, { useState } from "react"
import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL

const Search = () => {

    const [query, setQuery] = useState("")
    const [users, setUsers] = useState([])
    const [posts, setPosts] = useState([])

    const handleSearch = async () => {

        if (!query.trim()) {
            setUsers([])
            setPosts([])
            return
        }

        try {

            const res = await axios.get(
                `${API_URL}/search?query=${query}`
            )

            setUsers(res.data.users)
            setPosts(res.data.posts)

        } catch (error) {

            console.error(error)

        }
    }

    return (
        <div>

            <h2>Search</h2>

            <input
                type="text"
                placeholder="Search users or posts..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />

            <button onClick={handleSearch}>
                Search
            </button>

            {/* USERS */}

            <h3>Users</h3>

            {users.length === 0 ? (
                <p>No users found</p>
            ) : (
                users.map((user) => (
                    <div key={user._id}>

                        {user.profileImage && (
                            <img
                                src={user.profileImage}
                                alt="Profile"
                                style={{
                                    width: "50px",
                                    height: "50px",
                                    borderRadius: "50%",
                                    objectFit: "cover"
                                }}
                            />
                        )}

                        <p>{user.username}</p>

                    </div>
                ))
            )}

            {/* POSTS */}

            <h3>Posts</h3>

            {posts.length === 0 ? (
                <p>No posts found</p>
            ) : (
                posts.map((post) => (
                    <div key={post._id}>

                        <img
                            src={post.image}
                            alt="Post"
                            style={{
                                width: "200px"
                            }}
                        />

                        <p>
                            <b>{post.username}</b>
                        </p>

                        <p>
                            {post.caption}
                        </p>

                    </div>
                ))
            )}

        </div>
    )
}

export default Search