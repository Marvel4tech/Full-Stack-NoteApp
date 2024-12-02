import React, { useState } from 'react'
import ProfileInfo from '../Cards/ProfileInfo'
import { useNavigate } from 'react-router-dom'
import SearchBar from '../SearchBar/SearchBar'
import { toast } from 'react-toastify'

const Navbar = ({ userInfo }) => {
  const [searchQuery, setSearchQuery] = useState("")

  const navigate = useNavigate()

  //const onLogout = () => {
    //localStorage.clear()
    //toast.success("Logout Successfully")
    //navigate("/login") 
  //}

  const onLogout = () => {
    localStorage.clear();
    toast.success("Logout Successfully");
    setTimeout(() => {
      navigate("/login");
    }, 1000); // Delay navigation by 1 second
  }

  const handleSearch = () => {

  }

  const onClearSearch = () => {
    setSearchQuery("")
  }

  return (
    <div className=' bg-white flex items-center justify-between px-6 py-2 drop-shadow'>
        <h2 className=' text-xl font-medium text-black py-2'>Notes</h2>
        <SearchBar 
          value={searchQuery} 
          onChange={({ target }) => setSearchQuery(target.value)}
          onClearSearch={onClearSearch}
          handleSearch={handleSearch}
        />
        <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
    </div>
  )
}

export default Navbar