import { connect } from "mongoose"

const dbConnection = async () => {
    try {
        const db = await connect(process.env.CONNECT_URI)
        console.log(`Database is connected Successfully : ${db.connection.host}, ${db.connection.name}`)
    } catch (error) {
        console.log("Database failed", error)
    }
}

export default dbConnection