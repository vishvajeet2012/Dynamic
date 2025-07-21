import { useEffect } from "react";
import { useSearchPage } from "../../hooks/use-searchpage";

export default function SearchBar() {

   const { searchPage, searchResult, loading, error, success } =useSearchPage()


const handleSearchValue= (e)=>{

const keyword= e.target?.value

        if(keyword.length  >=3)
        {
            console.log(keyword)
            searchPage(keyword)
        }

}

            useEffect(()=>{
console.log(searchResult)
            },[searchResult])

    return (
        <>
            <div className="">
                <input 
                    onChange={handleSearchValue}
                    type="text "
                    placeholder=" "
                    className= "w-52 lg:w-96  rounded-sm py-1  outline-none bg-white text-black" 
                />
            </div>
        </>
    );
}
