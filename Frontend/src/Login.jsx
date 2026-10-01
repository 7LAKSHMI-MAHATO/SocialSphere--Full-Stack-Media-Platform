import React, { useState } from "react"
import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL

const Login = () => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleLogin = async (e) => {

        e.preventDefault()

        try {

            const res = await axios.post(
                `${API_URL}/login`,
                {
                    email,
                    password
                }
            )

            alert(res.data.message)

            localStorage.setItem(
                "user",
                JSON.stringify(res.data.user)
            )

            setEmail("")
            setPassword("")

        } catch (err) {

            console.error(err)

            alert(
                err.response?.data?.message ||
                "Login failed"
            )
        }
    }

    return (
        <div>

            <h2>Login</h2>

            <form onSubmit={handleLogin}>

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
                    Login
                </button>

            </form>

        </div>
    )
}

export default Login