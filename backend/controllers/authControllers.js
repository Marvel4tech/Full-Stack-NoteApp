import User from "../models/userModel.js"
import bcrypt from "bcryptjs"

export const register = async (req, res) => {
    const { fullName, email, password } = req.body

    if(!fullName) {
        res.status(400).json({ error: true, message: "Please provide a full name." })
        return
    }

    if(!email) {
        res.status(400).json({ error: true, message: "Please provide a username." })
        return
    }

    if(!password) {
        res.status(400).json({ error: true, message: "Please provide a password." })
        return
    }

    const isUser = await User.findOne({ email: email })
    if(isUser) {
        res.status(400).json({ message: "This email is already registered." })
        return
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10)
        const registered = await User.create({
            fullName,
            email,
            password: hashedPassword,
        })
        res.status(200).json({ message: "Your registration is successfull", registered })
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "Registration failed" })
    }

    
}

export const login = async (req, res) => {
    
}