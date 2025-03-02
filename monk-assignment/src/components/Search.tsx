import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useState,useEffect } from "react";

interface SearchProps{
    setSearchQuery:(query:string)=>void
}

function Search({setSearchQuery}:SearchProps) {
    const [search,setSearch]=useState("")

    useEffect(()=>{
        const handler=setTimeout(()=>{
            setSearchQuery(search)  //debouncing the search query
        
        },500)

        return ()=>clearTimeout(handler);  // Cleanup on re-render or unmount
    },[search,setSearchQuery])

    

    
  return (
    <>
     <div className="relative w-full px-8 py-4 border-b-1 border-gray-200">
      <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 p-8" />
      <input
      type="text"
      placeholder="Search..."
      className="pl-10 pr-3 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      value={search}
      onChange={(e)=>setSearch(e.target.value)}
      />
     </div>
      
    </>
  )
}

export default Search
