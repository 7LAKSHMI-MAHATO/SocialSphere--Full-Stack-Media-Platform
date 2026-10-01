import React, { useState } from "react"
import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL

const Signup = () => {

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleSignup = async (e) => {

        e.preventDefault()

        try {

            const res = await axios.post(
                `${API_URL}/signup`,
                {
                    username,
                    email,
                    password
                }
            )

            alert(res.data.message)

            setUsername("")
            setEmail("")
            setPassword("")

        } catch (err) {

            console.error(err)

            alert(
                err.response?.data?.message ||
                "Signup failed"
            )
        }
    }

    return (
        <div>

            <h2>Signup</h2>

            <form onSubmit={handleSignup}>

                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) =>
                        setUsername(e.target.value)
                    }
                />

                <br /><br />

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                />

                <br /><br />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                />

                <br /><br />

                <button type="submit">
                    Sign Up
                </button>

            </form>

        </div>
    )
}

export default Signup