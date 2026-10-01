import React, { useState, useEffect } from "react"
import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL

const Profile = () => {

    const user = JSON.parse(localStorage.getItem("user"))

    const [posts, setPosts] = useState([])

    const [profileImage, setProfileImage] = useState(
        user.profileImage || ""
    )

    const [editingProfile, setEditingProfile] = useState(false)

    const [newUsername, setNewUsername] = useState(
        user.username
    )

    // ================= GET POSTS =================

    useEffect(() => {

        const fetchPosts = async () => {

            try {

                const res = await axios.get(
                    `${API_URL}/posts`
                )

                setPosts(res.data.posts)

            } catch (err) {

                console.error(err)

            }

        }

        fetchPosts()

    }, [])

    // ================= MY POSTS =================

    const myPosts = posts.filter(
        (post) => post.username === user.username
    )

    // ================= UPDATE PROFILE =================

    const handleUpdateProfile = async () => {

        try {

            const res = await axios.put(
                `${API_URL}/profile`,
                {
                    oldUsername: user.username,
                    newUsername: newUsername
                }
            )

            // Update localStorage

            localStorage.setItem(
                "user",
                JSON.stringify(res.data.user)
            )

            setEditingProfile(false)

            alert("Profile updated successfully")

            // Refresh page

            window.location.reload()

        } catch (err) {

            console.error(err)

            alert(
                err.response?.data?.message ||
                "Failed to update profile"
            )

        }

    }

    // ================= PROFILE IMAGE =================

    const handleProfileImage = async (e) => {

        const file = e.target.files[0]

        if (!file) return

        try {

            const formData = new FormData()

            formData.append(
                "profileImage",
                file
            )

            formData.append(
                "username",
                user.username
            )

            const res = await axios.put(
                `${API_URL}/profile/image`,
                formData
            )

            // Update localStorage

            localStorage.setItem(
                "user",
                JSON.stringify(res.data.user)
            )

            setProfileImage(
                res.data.user.profileImage
            )

            alert(
                "Profile picture updated successfully"
            )

        } catch (err) {

            console.error(err)

            alert(
                err.response?.data?.message ||
                "Failed to upload profile picture"
            )

        }

    }

    // ================= UI =================

    return (

        <section>

            <h1>My Profile</h1>

            {/* PROFILE PICTURE */}

            <div>

                {profileImage && (

                    <img
                        src={profileImage}
                        alt="Profile"
                        style={{
                            width: "120px",
                            height: "120px",
                            borderRadius: "50%",
                            objectFit: "cover"
                        }}
                    />

                )}

                <br />

                <label
                    style={{
                        display: "inline-block",
                        marginTop: "10px",
                        padding: "8px 14px",
                        backgroundColor: "#eee",
                        borderRadius: "6px",
                        cursor: "pointer"
                    }}
                >

                    Edit Profile Image

                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleProfileImage}
                        style={{
                            display: "none"
                        }}
                    />

                </label>

            </div>


            {/* USERNAME / EDIT PROFILE */}

            {
                editingProfile ? (

                    <div>

                        <input
                            type="text"
                            value={newUsername}
                            onChange={(e) =>
                                setNewUsername(
                                    e.target.value
                                )
                            }
                        />

                        <button
                            onClick={handleUpdateProfile}
                        >
                            Save
                        </button>

                        <button
                            onClick={() => {

                                setEditingProfile(false)

                                setNewUsername(
                                    user.username
                                )

                            }}
                        >
                            Cancel
                        </button>

                    </div>

                ) : (

                    <div>

                        <h2>
                            {user.username}
                        </h2>

                        <button
                            onClick={() =>
                                setEditingProfile(true)
                            }
                        >
                            Edit Profile Name
                        </button>

                    </div>

                )
            }


            {/* POST COUNT */}

            <p>
                Posts: {myPosts.length}
            </p>


            {/* MY POSTS */}

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(3, 1fr)",
                    gap: "15px",
                    marginTop: "20px"
                }}
            >

                {
                    myPosts.length > 0 ? (

                        myPosts.map((post) => (

                            <div key={post._id}>

                                <img
                                    src={post.image}
                                    alt={post.caption}
                                    style={{
                                        width: "100%",
                                        height: "200px",
                                        objectFit: "cover"
                                    }}
                                />

                                <p>
                                    {post.caption}
                                </p>

                            </div>

                        ))

                    ) : (

                        <p>
                            You have not posted anything yet.
                        </p>

                    )
                }

            </div>

        </section>

    )

}

export default Profile