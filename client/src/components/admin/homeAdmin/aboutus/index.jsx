export default function AdminAboutUs(){

    

    return (
        <>
                <div className="w-full  text-black p-4">
                <div className="flex justify-between  ">
                    <h1 >
                    About Us 
                    </h1>
                    <div className="flex flex-row gap-8">
                    <h1>Main Manu</h1>
                    <h2>Back</h2>
                     </div>

                </div>     
                <div className="  ">
                    <div className="text-black bg-slate-300 flex w-1/2 flex-col justify-center  gap-2 ">
                                            <div className="flex flex-col">
                                                <label>About us Heading</label>
                                                <input type='text' className="  " />
                                            </div>
                                            <div className="flex flex-col ">
                                                            <label>About us Description</label>
                                                            <input type='text' className=""/>
                                            </div>
                                            <div className="flex flex-col">
                                            <label>isHomepage</label>
                                            <input type='checkbox' className=""/>

                                            </div>

                    </div>
                </div>
                </div>

        </>
    )
}