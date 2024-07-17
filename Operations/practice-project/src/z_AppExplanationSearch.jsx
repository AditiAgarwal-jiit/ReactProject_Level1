import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'

function App() {
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [query, setQuery] = useState('');

  useEffect(()=>{
    axios.get('https://dummyjson.com/products')
    .then((res)=> {
      setData(res.data.products);
      setFilteredData(res.data.products);
    });
  },[])

  const handleSearchInput = (e)=>{
    // Way-1:
    setFilteredData(data.filter((product)=>{
      return product.title.toLowerCase().includes(e.target.value.toLowerCase())
    }))
    // Way-2:
    // setQuery(e.target.value.toLowerCase());

   /** The below method not working when I do setQuery on onChange and pass query to data.filter
    * and set filteredData.
    * Doing 2 setStates on onChange isn't working.
    * This method is combining both way-1 and way-2. Use only 1 way.
    * Set only 1 state on onChange. Don't set 2 states.
    * Either set query and use it on render to filter data or set filteredata and use it on render **/
  //   setFilteredData(data.filter((product)=>{
  //     return product.title.toLowerCase().includes(query)
  //  }))   -- WRONG
 
  // Way-1: Set filtered data on onChange by passing e.target.value and use the filtered data for render
  // Way-2: Set query on onChange and directly filter data on render by passing query
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
