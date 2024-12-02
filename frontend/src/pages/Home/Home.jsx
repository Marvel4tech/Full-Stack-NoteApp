import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import NoteCard from '../../components/Cards/NoteCard'
import { MdAdd } from "react-icons/md"
import AddEditNotes from './AddEditNotes'
import Modal from 'react-modal'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'
import { ToastContainer } from "react-toastify"

const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({ isShown: false, type: "add", data: null })


  const [userInfo, setUserInfo] = useState(null)
  const [allNotes, setAllNotes] = useState([])

  const navigate = useNavigate()

  const handleEdit = (noteDetails) => {
    setOpenAddEditModal({ isShown: true, type: "edit", data: noteDetails })
  }

  // Get User Info
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user)
      }
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.clear()
        navigate("/login")
      }
    }
  };

  useEffect(() => {
    getAllNotes()
    getUserInfo()
    return () => {}
  }, [])

  // Get All Notes
  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get("/get-all-notes")

      if (response.data && response.data.notes) {
      setAllNotes(response.data.notes)
    }
    } catch (error) {
      console.log("An unexpected error occured. Please try again", error)
    }
  }

  return (
    <>
      <Navbar userInfo={userInfo} />

      <div className=' container mx-auto'>
        <ToastContainer />
        <div className=' grid grid-cols-3 gap-4 mt-8'>
          {allNotes.map((allNote, i) => (
            <NoteCard key={allNote._id} 
              title={allNote.title} 
              date={allNote.createdOn} 
              content={allNote.content} 
              tags={allNote.tags}
              isPinned={allNote.isPinned} 
              onEdit={() => handleEdit(allNote)} onDelete={() => {}} onPinNote={() => {}}
            />
          ))}
        </div>
      </div>

      <button className=' w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 
      bottom-10 ' onClick={() => {setOpenAddEditModal({ isShown: true, type: "add", data: null})}}>
          <MdAdd className=' text-[32px] text-white'/>
      </button>

      <Modal isOpen={openAddEditModal.isShown} onRequestClose={() => {}} style={{overlay: {backgroundColor: "rgba(0,0,0,0.2)",}}} 
      contentLabel="" className=" w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll" 
      appElement={document.getElementById('root')} >
          <AddEditNotes
            type={openAddEditModal.type}
            noteData={openAddEditModal.data}
            onClose={() => setOpenAddEditModal({ isShown:false, type: "add", data: null })}
            getAllNotes={getAllNotes}
          />
      </Modal>
    </>
  )
}

export default Home