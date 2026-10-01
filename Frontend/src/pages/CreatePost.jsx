import React from 'react'
import axios from 'axios'
import { useNavigate} from 'react-router-dom'

const CreatePost = () => {
   const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()


    const formData = new FormData(e.target)

const user = JSON.parse(
    localStorage.getItem("user")
)

formData.append(
    "username",
    user.username
)
    axios.post(`${import.meta.env.VITE_API_URL}/create-post`, formData)
      .then((res) => {
      navigate("/feed")

       })
       .catch((err) => {
        console.error(err)
        alert("Error creating post")
       })
  }

  return (
   <section className="create-post-section"> 
   <h1>Create post</h1>
   <form onSubmit={handleSubmit}>
    <input type='file' name='image' accept='image/*'  />
    <input type='text' name= 'caption' placeholder='Enter caption' required />
    <button type='submit' >Submit</button>
   </form>

   </section>
  )
}

export default CreatePost
