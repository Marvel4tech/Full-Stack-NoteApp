import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import dbConnection from "../config/dbConnect.js"
import authRoutes from "../routes/authRoutes.js"

dotenv.config()
dbConnection()

const app = express()

const corsOptions = {
    origin: "http://localhost:4001",
    credentials: true,
}
app.use(cors(corsOptions))
app.use(express.json())

app.use("/api", authRoutes)

const PORT = process.env.PORT || 4001
app.listen(PORT, (req, res) => {
    console.log(`Server is running on port ${PORT}`)
})
