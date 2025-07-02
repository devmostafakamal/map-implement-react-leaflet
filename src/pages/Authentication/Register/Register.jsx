import React, { useState } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../../hooks/useAuth";
import { Link } from "react-router";
import SocialLogin from "../socialLogin/SocialLogin";
import axios from "axios";
import useAxios from "../../../hooks/useAxios";

function Register() {
  const { createUser, updateUserProfile } = useAuth();
  const axiosInstance = useAxios();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [profilePic, setProfilePic] = useState("");
  const onSubmit = (data) => {
    // console.log(data);
    createUser(data.email, data.password)
      .then(async (result) => {
        console.log(result.user);
        //update userInfo in the databse
        const userInfo = {
          email: data.email,
          role: "user", //default role
          created_at: new Date().toISOString(),
          last_log_in: new Date().toISOString(),
        };
        const userRes = await axiosInstance.post("/users", userInfo);
        console.log(userRes.data);
        // update user profile in the firebase
        const userProfile = {
          displayName: data.name,
          photoURL: profilePic,
        };
        updateUserProfile(userProfile)
          .then(() => {
            console.log("profile pic updated successfully");
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleImageUpload = async (e) => {
    const image = e.target.files[0];
    console.log(image);
    const imageUploadUrl = `https://api.imgbb.com/1/upload?key=${
      import.meta.env.VITE_image_upload_key
    } `;
    const formData = new FormData();
    formData.append("image", image);
    const res = await axios.post(imageUploadUrl, formData);
    setProfilePic(res.data.data.url);
  };
  return (
    <div className="text-center lg:text-left">
      <h1 className="text-5xl font-bold">Create an account</h1>

      <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit)}>
            <fieldset className="fieldset">
              <label className="label">Your Name</label>
              <input
                type="text"
                className="input"
                {...register("name", {
                  required: true,
                })}
                placeholder="Name"
              />
              {errors.name?.type === "required" && (
                <p className="text-red-500">Name is required</p>
              )}
              <label className="label">Your Name</label>
              <input
                type="file"
                className="input"
                placeholder="Your profile picture"
                onChange={handleImageUpload}
              />
              {errors.name?.type === "required" && (
                <p className="text-red-500">Name is required</p>
              )}
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
