import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'
import clearFilterSvg from './assets/clearFilterSvg.svg'
import sortIconSvg from './assets/sortIconSvg.svg'
import resetSortIconSvg from './assets/resetSortIconSvg.svg'

function App() {
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [isFilterSelected, setIsFilterSelected] = useState(false)
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [isSortAscending, setIsSortAscending] = useState(true)
  const [sortCallback, setSortCallback] = useState(()=> ()=> {})
//   let myData = [
//     {
//         id: crypto.randomUUID(),
//         title: 'Milk',
//         category: 'Grocery',
//         price: 40,
//     },
//     {
//         id: crypto.randomUUID(),
//         title: 'Shirt',
//         category: 'Clothes',
//         price: 600,
//     },
//     {
//         id: crypto.randomUUID(),
//         title: 'Vegetables',
//         category: 'Grocery',
//         price: 100,
//     },
//     {
//         id: crypto.randomUUID(),
//         title: 'Electricity Bill',
//         category: 'Bills',
//         price: 40,
//     },
// ];

  useEffect(() => {
    axios.get('https://dummyjson.com/products')
      .then((res) => {
        setData(res.data.products);
        setFilteredData(res.data.products);
      });
  }, [sortCallback])

  useEffect(() => {
    addCategories(data && data)
  }, [data])

  function addCategories(products) {
    const categoryArray = [];
    products.forEach((product) => {
      if (categoryArray.indexOf(product.category) == -1) {
        categoryArray.push(product.category)
      }
    })
    setCategories(categoryArray)
  }
 

  // 1.SEARCH:
  const handleSearchInput = (e) => {
    setFilteredData(data.filter((product) => {
      return product.title.toLowerCase().includes(e.target.value.toLowerCase())
    }))
  }

  // 2. FILTER
  const handleFilter = (e) => {
    filterUtil(e.target.value.toLowerCase(), true)
  }

  const handleClearFilter = (e) => {
    e.target.value = '';
    filterUtil(e.target.value, false)
  }

  const filterUtil = (val, isFilter) => {
    setSelectedCategory(val)
    setIsFilterSelected(isFilter)
    setFilteredData(data.filter(product => {
      return product.category.toLowerCase().includes(val)
    }))
  }

  // 3. SORT:
  // const handleSort = () => {
  //   if(isSortAscending){
  //     setIsSortAscending(false);
  //     setFilteredData(prev => [...prev.sort((a, b) => a.price - b.price)])
  //   }
  //   else{
  //     setIsSortAscending(true);
  //     setFilteredData(prev => [...prev.sort((a, b) => b.price - a.price)])
  //   }
  // }

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
    // console.log('clicked')
    setIsSortAscending(true);
    // console.log(filteredData.sort(sortCallback))
    setSortCallback(()=> ()=> {})
    
  }

  return (
    <>
      <div>
        <div className='inputContainers'>
          <div className='searchContainer'>
            <label htmlFor='search'> Enter Name</label>
            <input type='text' name='search'
              onChange={handleSearchInput} />
            <button> Search </button>
          </div>
          <div className='filters'>
            {
              <select value={selectedCategory} onChange={handleFilter}>
                <option hidden> Categories </option>
                {
                  categories?.map((category, index) => {
                    return <option value={category} key={index}> {category}</option>
                  })
                }
              </select>
            }

            {isFilterSelected &&
              <img src={clearFilterSvg} onClick={handleClearFilter} />}
          </div>
          <div className='resetSortImg'>
            <img src={resetSortIconSvg} alt='reset=sort' onClick={resetSort}/>
          </div>
        </div>
        <table className='tableContainer'>
          <thead>
            <tr>
              <th>Product Id</th>
              <th>Title</th>
              <th>Category</th>
              <th>Price <img src={sortIconSvg} alt="sort-icon"
                onClick={handleSortAdvanced} /></th>
            </tr>
          </thead>
          <tbody>
            {
              filteredData.sort(sortCallback).map((product) => {
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
        </table>
      </div>
    </>
  )
}

export default App
