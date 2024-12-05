import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import dbConnection from "../config/dbConnect.js"
import authRoutes from "../routes/authRoutes.js"
import noteRoutes from "../routes/noteRoutes.js"

dotenv.config()
dbConnection()

const app = express()

const corsOptions = {
    origin: "full-stack-note-app-ten.vercel.app",
    credentials: true,
}
app.use(cors(corsOptions))
app.use(express.json())

app.use("/api", authRoutes)
app.use("/api", noteRoutes)

const PORT = process.env.PORT || 4001
app.listen(PORT, (req, res) => {
    console.log(`Server is running on port ${PORT}`)
})
