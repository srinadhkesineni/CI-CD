import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Home(){
    const navigate = useNavigate() 
    const [isLoggedIn, setisLoggedIn] = useState(false)

    useEffect(()=>{
        const token = localStorage.getItem("token");
        if (token){
            setisLoggedIn(true)
            navigate("/dashboard")
        }
    },[navigate])

    return (
        <div className="home-container">
      {!isLoggedIn ? (
        <>
          <h1>Welcome to CI/CD Dashboard</h1>
          <button onClick={() => navigate("/login")}>Login</button>
          <button onClick={() => navigate("/signup")}>Signup</button>
        </>
      ) : (
        <p>Redirecting to dashboard...</p>
      )}
    </div>
    )
}

