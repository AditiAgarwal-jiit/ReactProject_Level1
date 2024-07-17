import React, { useState } from 'react'
import sortIconSvg from '../assets/sortIconSvg.svg'


const Table = ({filteredData}) => {
    const [sortCallback, setSortCallback] = useState(()=> ()=> {})
    const [isSortAscending, setIsSortAscending] = useState(true)
    const myData = filteredData
    const handleSortAdvanced = ()=>{
        if(isSortAscending){
          setIsSortAscending(false);
           setSortCallback(()=> (a,b)=> a.price - b.price)
        }
        else{
          setIsSortAscending(true);
          setSortCallback(()=> (a,b)=> b.price-a.price)
        }
      }
    
      const resetSort = ()=>{
        console.log('clicked')
        setIsSortAscending(true);
        // console.log(filteredData.sort(sortCallback))
        setSortCallback(()=> ()=> {})
        
      }

  return (
    <div>
       /* <table className='tableContainer'>
          <thead>
            <tr>
              <th>Product Id</th>
              <th>Title <img src={sortIconSvg} alt="sort-icon" onClick={handleSortAdvanced} /></th>
              <th onClick={resetSort}>Category</th>
              <th>Price <img src={sortIconSvg} alt="sort-icon"
                onClick={handleSortAdvanced} /></th>
            </tr>
          </thead>
          <tbody>
            {
              myData.sort(sortCallback).map((product) => {
                return (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.title}</td>
                    <td>{product.category}</td>
                    <td>&nbsp; &nbsp; ${product.price} &nbsp; &nbsp;</td>
                  </tr>
                )
              })
            }
          </tbody>
        </table> */
      
    </div>
  )
}

export default Table
