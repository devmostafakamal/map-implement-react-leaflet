import React from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../../hooks/useAuth";
import { Link } from "react-router";
import SocialLogin from "../socialLogin/SocialLogin";

function Register() {
  const { createUser } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    // console.log(data);
    createUser(data.email, data.password)
      .then((result) => {
        console.log(result.user);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div className="text-center lg:text-left">
      <h1 className="text-5xl font-bold">Create an account</h1>

      <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit)}>
            <fieldset className="fieldset">
              <label className="label">Email</label>
              <input
                type="email"
                className="input"
                {...register("email", {
                  required: true,
                })}
                placeholder="Email"
              />
              {errors.email?.type === "required" && (
                <p className="text-red-500">Email is required</p>
              )}

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
                <p className="text-red-500">Password required</p>
              )}
              {errors.password?.type === "minLength" && (
                <p className="text-red-500">
                  Password must be 6 characters or longer
                </p>
              )}
              <div>
                <a className="link link-hover">Forgot password?</a>
              </div>

              <button className="btn btn-primary mt-4 text-black">
                Register
              </button>
            </fieldset>
            <p>
              <small>
                Already have an account?<Link to="/login">Login</Link>
              </small>
            </p>
          </form>
          <SocialLogin></SocialLogin>
        </div>
      </div>
    </div>
  );
}

export default Register;
