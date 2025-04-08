import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {ApiError} from "../utils/ApiError.js"
const registerUser = asyncHandler(async (req,res)=>{
    //get user details from frontend
    //validation - not empty
    //check if already exists  by username and email
    //check for images , check for avatar
    //upload them to cloudinary,avatar
    //create user object - create entry in db
    //remove password and refresh token field
    //check for user creation 
    //return res
    
    const {fullname,email,username,password} = req.body
    console.log("Email is ", email);
    console.log("Username is ",username)
    
    if(
        [fullname,email,username,password].some((field)=>
       field?.trim()==="" )
    ){
        throw new ApiError(400,"All fields are required");
    }

   const exitedUser = await  User.findOne({
        $or : [{username},{email}]
    })
    if(exitedUser){
        throw new ApiError(409,"User with this username or email already exists");
    }
    const avatarlocalPath = req.files?.avatar[0]?.path;
   // const coverImagelocalPath = req.files?.coverImage[0]?.path;
   let coverImagelocalPath;
   if(res.files && Array.isArray(res.files.coverImage) && req.files.coverImage.length>0){
    coverImagelocalPath = req.files.coverImage[0].path
   }
    if(!avatarlocalPath){
        throw new ApiError(404,"Avatar file is required");
    }
  const avatar = await uploadOnCloudinary(avatarlocalPath)
  const coverImage = await uploadOnCloudinary(coverImagelocalPath);
  if(!avatar){
    throw new ApiError(404,"Avatar file is required");
  }
  const user = await User.create({
    fullname,
    avatar : avatar.url,
    coverImage : coverImage?.url || "",
    email,
    password,
    username : username.toLowerCase()
  })

   const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
   )
   if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering the user")
   }
   return res.status(201).json(
        new ApiResponse(200,createdUser,"User registered Successfully")
   )
})

export {registerUser}