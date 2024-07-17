import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'

function App() {
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])

  useEffect(()=>{
    axios.get('https://dummyjson.com/products')
    .then((res)=> {
      setData(res.data.products);
      setFilteredData(res.data.products);
    });
  },[])

  const handleSearchInput = (e)=>{
    setFilteredData(data.filter((product)=>{
      return product.title.toLowerCase().includes(e.target.value.toLowerCase())
    }))
    }

  return (
    <>
      <div>
        <div className='searchContainer'>
          <label htmlFor='search'> Enter Name</label>
          <input type='text' name='search'
          onChange={handleSearchInput} />
          <button> Search </button>
        </div>
        <table className='tableContainer'>
          <thead>
            <tr>
            <th>Product Id</th>
            <th>Title</th>
            <th>Price</th>
            </tr>
          </thead>
          <tbody>
           {
            filteredData.filter((product)=>{
              return product.title.toLowerCase().includes(query)
           }).map((product)=>{
              return(
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.title}</td>
                  <td>${product.price}</td>
                </tr>
              )
            })
           }
          </tbody>
        </table>
      </div>
    </>
  )
}

export default App
