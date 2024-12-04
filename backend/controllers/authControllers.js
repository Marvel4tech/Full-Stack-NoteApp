import User from "../models/userModel.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

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

        const token = jwt.sign(
            { _id: registered._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        )
        res.status(200).json({ message: "Your registration is successfull", registered, token })
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "Registration failed" })
    }

    
}

export const login = async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email })

        if(!user) {
            return res.status(404).json({ message: "user is not found" })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" })
        }

        const token = jwt.sign(
            { _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "3h" }
        )
        console.log({ message: "Login is successful", email, token })
        res.status(200).json({ message: "Login Successful", email, token })
    } catch (error) {
        console.log(error)
        res.status(500).json({message: `Something went wrong`})
    }
}

export const getUser = async (req, res) => {
    const { user } = req;

    const isUser = await User.findOne({ _id: user._id })
    if (!isUser) {
        return res.status(404).json({ message: "User not found" })
    }

    return res.status(200).json({ user: {
        _id: isUser._id,
        fullName: isUser.fullName,
        email: isUser.email,
        createdAt: isUser.createdOn,
    }, message: "" })
}