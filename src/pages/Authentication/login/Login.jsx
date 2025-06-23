import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import SocialLogin from "../socialLogin/SocialLogin";

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };
  return (
    <div className="text-center lg:text-left">
      {" "}
      <h1 className="text-5xl font-bold">Please Login</h1>
      <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit)}>
            <fieldset className="fieldset">
              <label className="label">Email</label>
              <input
                type="email"
                className="input"
                {...register("email")}
                placeholder="Email"
              />
              <label className="label">Password</label>
              <input
                type="password"
                className="input"
                {...register("password", {
                  required: true,
                  minLength: 6,
                })}
                placeholder="Password"
              />
              {errors.password?.type === "required" && (
                <p className="text-red-500">Password is required</p>
              )}
              {errors.password?.type === "minLength" && (
                <p>password must be 6 characters or longer</p>
              )}
              <div>
                <a className="link link-hover">Forgot password?</a>
              </div>
              <button className="btn btn-primary text-black  mt-4">
                Login
              </button>
            </fieldset>

            <p>
              New to this site? Please{" "}
              <Link className="btn bg-green-400" to="/register">
                Register
              </Link>
            </p>
          </form>
          <SocialLogin></SocialLogin>
        </div>
      </div>
    </div>
  );
}

export default Login;
