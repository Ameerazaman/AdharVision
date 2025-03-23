import { useState } from "react";
import ImageUpload from "./Componants/ImageUpload";
import ResponseUI from "./Componants/ResponseUI";
import { ApiResponseData } from "./Interface.ts/AadharData";

function App() {
  const [response, setResponse] = useState<ApiResponseData>({});
const[loading,setLoading]=useState(false)

const handleResponse=((data:ApiResponseData)=>{
  setResponse(data)
})

  return (
    <div className="bg-slate-100 min-h-screen text-white pt-10">
      {/* Navbar */}
      <nav className="bg-white text-[#0a192f] py-4 px-8 fixed top-0 left-0 w-full shadow-md z-10">
        <h1 className="text-4xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-gray-300 to-white drop-shadow-[0_0_15px_rgba(255,0,0,0.8)]">
          AdhaarVision
        </h1>


      </nav>

      {/* Main Content */}
      <div className="flex flex-col items-center gap-10 p-8 pt-20">
        <div className="flex flex-col md:flex-row justify-between w-full">
          <div className="flex-1 flex justify-center">
            <ImageUpload  handleResponse={handleResponse}/>
          </div>
          <div className="flex-1 flex justify-center">
            <ResponseUI data={response} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
