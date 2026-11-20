import { useContext, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../context/AuthContext";
import { useNavigate,useSearchParams } from "react-router-dom";

export default function Auth() {
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const mode = searchParams.get("mode") === "login" ? "login" : "signup";
  const { signUp, logIn } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { role: "buyer" } });

  async function onSubmit(data) {
    setError(null);
    const result =
      mode === "signup"
        ? await signUp(data.email, data.password, data.role)
        : await logIn(data.email, data.password);

    if (result.success) {
      navigate(result.user.role === "seller" ? "/seller" : "/");
    } else {
      setError(result.message);
    }
  }
  function switchMode(next) {
  setError(null);
  setSearchParams({ mode: next });
}
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setError(null), [mode]);
  

  return (
    <div className="page">
      <div className="container">
        <div className="auth-container">
          <h1 className="page-title">{mode === "signup" ? "Sign Up" : "Log In"}</h1>

          <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                id="email"
                className="form-input"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && <span className="form-error">{errors.email.message}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                id="password"
                className="form-input"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Password must be at least 6 characters" },
                  maxLength: { value: 20, message: "Password must be at most 20 characters" },
                })}
              />
              {errors.password && <span className="form-error">{errors.password.message}</span>}
            </div>

            {mode === "signup" && (
              <div className="form-group">
                <span className="form-label">I want to</span>
                <label>
                  <input type="radio" value="buyer" {...register("role")} /> Buy products
                </label>{" "}
                <label>
                  <input type="radio" value="seller" {...register("role")} /> Sell products
                </label>
              </div>
            )}

            <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Please wait..." : mode === "signup" ? "Sign Up" : "Log In"}
            </button>
          </form>
          <hr />
          <div className="auth-switch">
            {mode === "signup" ? (
              <p>
                Already have an account?{" "}
                <button type="button" className="auth-link" onClick={() => switchMode("login")}>
                  Log In
                </button>
              </p>
            ) : (
              <p>
                Don't have an account?{" "}
                <button type="button" className="auth-link" onClick={() => switchMode("signup")}>
                  Sign Up
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
