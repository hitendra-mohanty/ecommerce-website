import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Auth() {
    const [mode, setMode] = useState("signup");

    const [error,setError] = useState(null);

    const navigate = useNavigate();

    const { signUp, user, logOut, logIn } = useContext(AuthContext);

    const { register, handleSubmit, formState: { errors } } = useForm();

    function onSubmit(data){
        setError(null);
        let result ;
        if(mode === "signup"){
            result = signUp(data.email,data.password);
    }     else{
            result = logIn(data.email,data.password);
        }
        if(result.success){
            navigate("/");
        }else{
            setError(result.message);
        }

    }
    return (
        <div className="page">
           <div className="container">

            <div className="auth-container">
                {user && <div className="welcome-message">Welcome, {user.email}!</div>}
                <button onClick={() => logOut()}>Logout</button>
                <h1 className="page-title">
                    {mode === "signup" ? "Sign Up" : "Log In "}
                </h1>

                <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>

                    {error && <div className="error-message">{error}</div>}

                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input type="email" id="email" name="email"{...register("email",{required:"Email is required"})} className="form-input"/>
                        {errors.email && <span className="form-error">{errors.email.message}</span>}
                    </div>


                    <div className="form-group">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input type="password" id="password" name="password" 
                        {...register("password", 
                        { required: "Password is required" , 
                        minLength :{value:6, message:"Password must be at least 6 characters"},
                        maxLength:{value:20, message:"Password must be at most 20 characters"} 
                        })} className="form-input"/>
                        {errors.password && <span className="form-error">{errors.password.message}</span>}
                    </div>
                    
                    <button className="btn btn-primary" type="submit">
                        {mode === "signup" ? "Sign Up" : "Log In"}
                    </button>
                </form>

                <div className="auth-switch">
                    {mode === "signup" ? (
                        <p>Don't have an account? <span className="auth-link" onClick={() => setMode("login")}>Log In</span></p>
                    ) : (
                        <p>Already have an account? <span className="auth-link" onClick={() => setMode("signup")}>Sign Up</span></p>
                    )}
                </div>
            </div>
           </div>
        </div>
    )
}