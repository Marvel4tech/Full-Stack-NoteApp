import { Query } from "mongoose";
import Note from "../models/noteModel.js"

export const getAllNotes = async (req, res) => {
    const { user } = req;
    try {
        const notes = await Note.find({ userId: user._id }).sort({ isPinned: -1 });
        return res.json({ message: "All Notes retrived successfully", notes })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: true, message: "Note retriving failed" })
    }
}

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

export const editNote = async (req, res) => {
    const noteId = req.params.noteId
    const { title, content, tags, isPinned } = req.body
    const { user } = req;

    if(!title && !content && !tags) {
        res.status(400).json({ error: true, message: "Please provide at least one field to update." })
        return
    }

    try {
        const editNote = await Note.findOne({ _id: noteId, userId: user._id })

        if (!editNote) {
            res.status(404).json({ message: "Note not found." })
            return
        }

        if (title) {
            editNote.title = title;
        }

        if (content) {
            editNote.content = content;
        }

        if (tags) {
            editNote.tags = tags;
        }

        if (isPinned) {
            editNote.isPinned = isPinned;
        }
        await editNote.save()
        console.log({ message: "Note updated successfully", editNote })
        res.status(200).json({ error: false, message: "Note updated successfully", editNote })

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: true, message: "Internal Server Error" })
    }

    // A more efficient easier method to update using FindByIdAndUpdate
    /* export const editNote = async (req, res) => {
        const noteId = req.params.noteId;
        const { title, content, tags, isPinned } = req.body;
        const { user } = req;
    
        // Check if at least one field is provided to update
        if (!title && !content && !tags && isPinned === undefined) {
            return res.status(400).json({ error: true, message: "Please provide at least one field to update." });
        }
    
        // Create an object with the fields to update
        const updateFields = {};
        if (title) updateFields.title = title;
        if (content) updateFields.content = content;
        if (tags) updateFields.tags = tags;
        if (isPinned !== undefined) updateFields.isPinned = isPinned; // Check for undefined to allow false value
    
        try {
            const updatedNote = await Note.findByIdAndUpdate(
                noteId,
                { $set: updateFields },
                { new: true, runValidators: true }
            );
    
            // Check if the note was found and updated
            if (!updatedNote) {
                return res.status(404).json({ message: "Note not found." });
            }
    
            console.log({ message: "Note updated successfully", updatedNote });
            return res.status(200).json({ error: false, message: "Note updated successfully", updatedNote });
    
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: true, message: "Internal Server Error" });
        }
    } */
}

export const deleteNote = async (req, res) => {
    const noteId = req.params.noteId;
    const { user } = req;

    try {
        const deletedNote = await Note.findOneAndDelete({ _id: noteId, userId: user._id })

        if (!deletedNote) {
            return res.status(404).json({ message: "Note not found" })
        }

        return res.status(200).json({ message: "Note is deleted successfully", deletedNote })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "An error occurred while deleting the note." });
        
    }
}

export const updateNotePinned = async (req, res) => {
    const noteId = req.params.noteId;
    const { isPinned } = req.body;
    const { user } = req;

    try {
        const pinned = await Note.findByIdAndUpdate({ _id: noteId, userId: user._id })
        if (!pinned) {
            return res.status(404).json({ message: "Note not found" })
        }
        
        if (isPinned) {
            pinned.isPinned = isPinned;
        }
        await pinned.save()
        return res.status(200).json({ message: "Note is updated successfully", pinned })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "An error occurred while updating the pinned status of the note." })
    }

    // Another method to update without using save function
    /* export const updateNotePinned = async (req, res) => {
        const noteId = req.params.noteId;
        const { isPinned } = req.body;
        const { user } = req;
    
        try {
            // Use findOneAndUpdate to find the note by ID and userId
            const pinned = await Note.findOneAndUpdate(
                { _id: noteId, userId: user._id }, // Query to find the note
                { isPinned }, // Update the isPinned field
                { new: true } // Option to return the updated document
            );
    
            if (!pinned) {
                return res.status(404).json({ message: "Note not found" });
            }
    
            return res.status(200).json({ message: "Note is updated successfully", pinned });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "An error occurred while updating the pinned status of the note." });
        }
    } */
}

export const searchNotes = async (req, res) => {
    const { user } = req;
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ error: true, message: "Please provide a search query." })
    }

    try {
        const matchingNotes = await Note.find({
            userId: user._id,
            $or: [
                {title: { $regex: new RegExp(query, "i") } }, // Search for title with case-insensitive match
                { content: { $regex: new RegExp(query, "i") } }, // Search for content with case-insensitive match
            ]
        });

        // Check if there are matching notes
        if (matchingNotes.length === 0) {
            return res.json({ message: "No notes found matching the search query.", matchingNotes });
        }

        return res.json({ message: "Search results retrieved", matchingNotes })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" })
    }
}