import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'
import clearFilterSvg from './assets/clearFilterSvg.svg'

function App() {
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [isFilterSelected, setIsFilterSelected] = useState(false)
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')

  // const [categories, setCategories] = useState(new Set())

  useEffect(() => {
    axios.get('https://dummyjson.com/products')
      .then((res) => {
        setData(res.data.products);
        setFilteredData(res.data.products);
        // addCategories(res.data.products)
      });
  }, [])

  useEffect(() => {
    addCategories(data && data)
  }, [data])
  // --- populate the categories array after data state is successfully set. 
  /** Don't set categories using 'data' in the axios call. Because setting one state
   * and using it immediately to set aother state, results in inconsistencies and
   * unpredictable behaviour.
   * So let the data be set and then use it to set categories.
   * However, setting the categories like this: addCategories(res.data.products) inside axios .then(), 
   * will work totally fine. But addCategories(data) won't.
   */

  function addCategories(products) {
    // let categorySet = new Set();
    const categoryArray = [];
    products.forEach((product) => {
      if (categoryArray.indexOf(product.category) == -1) {
        categoryArray.push(product.category)
      }
      // categorySet = new Set([...categorySet, product.category])
      // setCategories([...categories, product.category])
      // setCategories(new Set([...categories,product.category]))
    })
    setCategories(categoryArray)
    // setCategories(categorySet)
  }

  useEffect(() => {
    console.log(categories)
  }, [categories])  // --- so always console.log the value after your state has been successully updated
                    // --- an not immediately after setState or say after state update function.
  // useEffect(()=>{
  //   function addCategories(products){
  //     products.map((product)=>{
  //       console.log(product.category)
  //       setCategories([...categories, product.category])  //--- setting state on every iteration is not good.
                                    // --- store this data in an array and then set it into the state at once.
  //      // setCategories(new Set([...categories,product.category]))
  //     })
  //     console.log("hiiii",categories)   // --- logging the state here will always give show a wrong/
                             // --- inconsistent value, because the clg runs immediately after setState has run.
                             // --- But state hasn't been updated till then. So it shows wrong/old value and
                             // --- hence the array always logs to be blank here. I think set state updates
                             // --- the state only after running all the synchronous code in it's containing block.
  //   }
  //   addCategories();
  // },[])


  // 1.SEARCH:
  const handleSearchInput = (e) => {
    setFilteredData(data.filter((product) => {
      return product.title.toLowerCase().includes(e.target.value.toLowerCase())
    }))
  }

  // 2. FILTER
  const handleFilter = (e) => {
    setSelectedCategory(e.target.value)  // --- set it equal to selected value to diplay that value on top of Select menu
    setIsFilterSelected(true)     // --- to show the clear/cross button
    setFilteredData(data.filter(product => {
      return product.category.toLowerCase().includes(e.target.value.toLowerCase())  // --- to filter the data list acc to selected value
    }))
  }

  const handleClearFilter = (e) => {
    e.target.value = '';
    setSelectedCategory('') // --- set it to empty string to reset the Select menu
    setIsFilterSelected(false)  // --- to hide the clear/cross button
    setFilteredData(data.filter(product => {
      return product.category.toLowerCase().includes(e.target.value)  // --- to reset the data list
    }))
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
              {/* --- to clear/reset the dropdown selection, always give value to 'Select'. 
               Value given to 'option' will not work in that case. It is only useful for extracting
               the selected value. And not for resetting the dropdown. If I clear and reset the
               categories array, it will reset and re-render the options, not the entire select menu. */}
                <option hidden> Categories </option>
                {
                  categories?.map((category, index) => {
                    return <option value={category} key={index}> {category}</option>
                  })
                }
              </select>
            }
            {/* <select name='productFilter' onChange={handleFilter}>
          <option hidden>Category</option>
          <option value='beauty' >Beauty</option>
          <option value='fragrances'>Fragrances</option>
          <option value='groceries'>Groceries</option>
          <option value='furniture'>Furniture</option>
        </select> */}
            {isFilterSelected &&
              <img src={clearFilterSvg} className="logo" alt="Vite logo" onClick={handleClearFilter} />}
          </div>
        </div>
        <table className='tableContainer'>
          <thead>
            <tr>
              <th>Product Id</th>
              <th>Title</th>
              <th>Category</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {
              filteredData.map((product) => {
                return (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.title}</td>
                    <td>{product.category}</td>
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
