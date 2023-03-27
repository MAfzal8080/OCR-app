import { useState, useRef } from 'react'
import axios from 'axios'
import Spinner from './Spinner'

function App() {
  const [image, setImage] = useState()
  const [imageData, setImageData] = useState()
  const [btn, setBtn] = useState("none")
  const [button, setButton] = useState("Copy")
  const [para, setPara] = useState(true)
  const [spinner, setSpinner] = useState(false)
  const ref =  useRef()
  const handleImage = (e) =>{
    setImage(e.target.files[0])
  }

  const handleApi = () =>{
    setSpinner(true)
    setPara(false)
    setImageData('')
    const data = new FormData()
    data.append('file', image)
    axios.post('http://localhost:5000/extracttextfromimage', data)
    .then((res) => {
      setImageData(res)
      setSpinner(false)
    })
  }

  const copyData = ()=>{
    navigator.clipboard.writeText(ref.current.innerText)
    setButton("Copied!")
    setInterval(() => {
      setButton("Copy")
    }, 1500);
  }

   const showBtn = ()=>{
    setBtn("block")
   }

   const hideBtn = ()=>{
    setBtn("none")
   }

  return (
    <div className='appBody'>
      <div className="bg-primary text-center p-2 m-auto">
        <h2 className="text-light">Extract info from document</h2>
     </div>
    
    <div className="container border border-1 border-black rounded-4 mt-5 bg-light m-auto" onMouseOver={showBtn} onMouseOut={hideBtn} style={{maxWidth: '500px'}}>
        <h3 className="text-xxl-center">Input</h3>
        <label htmlFor="file">Upload Image File:</label>
        <input type="file" className="form-control" name="file" onChange={handleImage} required />
        <button className="btn btn-dark my-2" onClick={handleApi} >Extract Text From Image</button>
        <div className="container mt-2 box">
            <h3 className="text-xxl-center">Output</h3>
            {imageData &&
            <>
            <span className={`float-end d-${btn} pe-auto m-4`} onClick={copyData}>
                <i className="fa-regular fa-clone"></i><span className="copy" style={{fontSize: 'small'}}> {button}</span>
            </span>
            <div className="container my-3" ref={ref}>
            <span>&#123;</span><br />
            <span> "idType": "{imageData.data.idType}"</span><br />
            <span> "idNumber": "{imageData.data.idNumber}"</span><br />
            <span>"info": &#123;</span><br />
              <span>&nbsp;&nbsp;&nbsp;&nbsp;  "name": "{imageData.data.name}"</span><br />
              {imageData.data.father && <><span>&nbsp;&nbsp;&nbsp;&nbsp;  "fatherName": "{imageData.data.father}"</span><br /></>}
              <span>&nbsp;&nbsp;&nbsp;&nbsp;  "dob": "{imageData.data.DOB}"</span><br />
              {imageData.data.gender && <><span>&nbsp;&nbsp;&nbsp;&nbsp;  "gender": "{imageData.data.gender}"</span><br /></>}
            <span>&nbsp;&nbsp;&nbsp;&nbsp; &#125;</span><br />
            <span>&#125;</span>
            </div>
            </>
            }
            {para && <p className='text-center'>Document not uploaded yet</p>}
            {spinner && <Spinner />}
        </div>
      </div>
      </div>
  )
}

export default App
