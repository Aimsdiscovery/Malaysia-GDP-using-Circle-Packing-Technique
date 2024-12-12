// Import the User model from userModel.js
import User from "../model/userModel.js";

// For posting data into the database
export const create = async(req, res)=>{
    try {
        // Create a new User instance with the request body
        const userData = new User( req.body);
        
        // Save the new user data into the database
        const savedUser = await userData.save();
        // Send a success response with the saved user data
        res.status(200).json(savedUser)
    } catch (error) {
        // Handle any errors and send an internal server error response
        res.status(500).json({error : "Internal Server Error. "})
    }
}

// For getting all users from the database
export const fetch = async (req, res)=>{
    try {
        // Find all users in the database
        const users = await User.find();
        // If no users are found, send a 404 error response
        if(users.length === 0 ){
            return res.status(404).json({message : "Users not Found."})
        }
        // Send a success response with the fetched users data
        res.status(200).json(users);
    } catch (error) {
        // Handle any errors and send an internal server error response
        res.status(500).json({error : " Internal Server Error. "})
    }
}

// For updating data
export const update = async (req, res)=>{
    try {
        // Extract user id from request parameters
        const id = req.params.id;
        // Check if the user with the given id exists
        const userExist = await User.findOne({_id:id})
        if (!userExist){
            return res.status(404).json({message : "User not found."})
        }
        // Update the user data and return the updated user
        const updateUser = await User.findByIdAndUpdate(id, req.body, {new : true});
        res.status(201).json(updateUser);
    } catch (error) {
        // Handle any errors and send an internal server error response
        res.status(500).json({error : " Internal Server Error. "})
    }
}

// For deleting data from the database
export const deleteUser = async (req, res)=>{
    try {
        // Extract user id from request parameters
        const id = req.params.id;
        // Check if the user with the given id exists
        const userExist = await User.findOne({_id:id})
        if(!userExist){
            return res.status(404).json({message : " User Not Found. "})
        }
        // Delete the user from the database
        await User.findByIdAndDelete(id);
        // Send a success response
        res.status(201).json({message : " User deleted Successfully."})
    } catch (error) {
        // Handle any errors and send an internal server error response
        res.status(500).json({error : " Internal Server Error. "})
    }
}