import Note from "../models/noteModel.js"

export const addNote = async (req, res) => {
    const { title, content, tags } = req.body;
    const { user } = req;

    if (!title) {
        res.status(400).json({ error: true, message: "Please provide a title." })
        return
    }

    if (!content) {
        res.status(400).json({ error: true, message: "Please provide a content." })
        return
    }

    try {
        const newNote = await Note.create({
            title,
            content,
            tags: tags || [],
            userId: user._id
        })
        console.log({ message: "Note added successfully", newNote })
        res.status(200).json({ message: "Note added successfully", newNote })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal Server Error"})
    }
}