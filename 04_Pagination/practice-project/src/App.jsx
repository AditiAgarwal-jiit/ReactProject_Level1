import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'
import clearFilterSvg from './assets/clearFilterSvg.svg'
import sortIconSvg from './assets/sortIconSvg.svg'
import resetSortIconSvg from './assets/resetSortIconSvg.svg'
import deleteIcon from './assets/deleteIcon.svg'

function App() {
  const [data, setData] = useState([])
  const [paginatedData, setPaginatedData] = useState([])
  const [isFilterSelected, setIsFilterSelected] = useState(false)
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [isPriceSortAscending, setIsPriceSortAscending] = useState(true)
  const [isTitleSortAscending, setIsTitleSortAscending] = useState(true)
  const [sortCallback, setSortCallback] = useState(() => () => { })
  const [headerKeys, setHeaderKeys] = useState([])
  const [checkboxStyle, setCheckboxStyle] = useState({})
  const [selectedRows, setSelectedRows] = useState([])
  const [deleteResult, setDeleteResult] = useState([])
  const [prev, setPrev] = useState(0)
  const [next, setNext] = useState(5)

  useEffect(() => {
    axios.get('https://dummyjson.com/products')
      .then((res) => {
        setData(res.data.products);
        // setPaginatedData(res.data.products);
      });
  }, [sortCallback])

  useEffect(() => {
    if (data && data.length > 0) {
      addCategories(data)
      getHeaderKeys(data);
      paginateData(data);
      setDeleteResult(data);
    }
    setCheckboxStyle(getCheckboxStyles())
  }, [data])

  useEffect(()=>{
    paginateData(deleteResult);
  },[prev, next])


  // UTILITY FUNCTIONS ---

  function addCategories(products) {
    const categoryArray = [];
    products.forEach((product) => {
      if (categoryArray.indexOf(product.category) == -1) {
        categoryArray.push(product.category)
      }
    })
    setCategories(categoryArray)
  }

  function getHeaderKeys([product]) {
    const additionalKeys = ['Actions']
    const [id, title, , category, price] = Object.keys(product);    // extract keys from products data
    setHeaderKeys([id, title, category, price].concat(additionalKeys));
    // console.log(paginatedData && paginatedData.length > 0 && Object.keys(product))
  }

  function toCamelCase(key) {
    return key.charAt(0).toUpperCase() + key.substring(1).toLowerCase()
  }

  function getCheckboxStyles() {
    return { visibility: 'hidden' }
  }

  // --- UTILITY FUNCTIONS


  // 1.SEARCH:
  const handleSearchInput = (e) => {
    const processedData = data.filter((product) => {
      return product.title.toLowerCase().includes(e.target.value.toLowerCase())
    })
    console.log(processedData)
    // don't change prev and next
    // this will take you to the next of the page on which you started the search
    // setPrev(prev => prev)
    // setNext(next => next)

    // or change them when input field is empty
    if(!e.target.value){
      setPrev(0)
      setNext(5)
      paginateData(processedData)
    }
    else{
    displaySearch(processedData)
    }
  }


  const displaySearch = (dataArray)=>{
    setPaginatedData(dataArray.slice(0,5))
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
    // setPaginatedData(data.filter(product => {
    //   return product.category.toLowerCase().includes(val)
    // }))
    const processedData = data.filter(product => {
      return product.category.toLowerCase().includes(val)
    })
    console.log('************',processedData)
    // the below logic works only because our data is already sorted for category. If it was unsorted, we need
    // to use same logic as we used for search
    let startIndex = data.indexOf(processedData[0])
    setPrev(startIndex)
    setNext(startIndex + 5)
    paginateData(processedData)
    // paginateData(paginatedData);
  }

  // 3. SORT:
  // const handleSort = () => {
  //   if(isSortAscending){
  //     setIsSortAscending(false);
  //     setPaginatedData(prev => [...prev.sort((a, b) => a.price - b.price)])
  //   }
  //   else{
  //     setIsSortAscending(true);
  //     setPaginatedData(prev => [...prev.sort((a, b) => b.price - a.price)])
  //   }
  // }

  const handleSortAdvanced = (sortParam) => {
    if (sortParam === 'price') {
      if (isPriceSortAscending) {
        setIsPriceSortAscending(false);
        setSortCallback(() => (a, b) => a.price - b.price)
      }
      else {
        setIsPriceSortAscending(true);
        setSortCallback(() => (a, b) => b.price - a.price)
      }
    }
    else {
      if (isTitleSortAscending) {
        setIsTitleSortAscending(false);
        setSortCallback(() => (a, b) => a.title.localeCompare(b.title))
      }
      else {
        setIsTitleSortAscending(true);
        setSortCallback(() => (a, b) => b.title.localeCompare(a.title))
      }
    }
  }

  const resetSort = () => {
    // console.log('clicked')
    setIsPriceSortAscending(true);
    setIsTitleSortAscending(true)
    // console.log(paginatedData.sort(sortCallback))
    setSortCallback(() => () => { })

  }

  // 4. DELETE:
  const handleDelete = (id) => {
    let processedData = deleteResult.filter((product) => {         
      return product.id !== id
    })
    setDeleteResult(processedData)
    paginateData(processedData)
  }

  // 5. DELETE MULTIPLE:
  const handleSelectClick = () => {
    console.log('clicked')
    setCheckboxStyle({
      ...checkboxStyle,
      visibility: checkboxStyle.visibility === 'hidden' ? 'visible' : 'hidden'
    })
  }

  const handleCheckboxClick = (e, id) => {
    const selectedRowsArr = [...selectedRows];
    if (e.target.checked) {
      e.target.checked && selectedRowsArr.push(id)
    }
    else {
      !e.target.checked && selectedRowsArr.splice(selectedRowsArr.indexOf(id), 1)
    }
    setSelectedRows([...selectedRowsArr])
    // e.target.checked && selectedRowsArr.push(id)
    // !e.target.checked && selectedRowsArr.splice(selectedRowsArr.indexOf(id), 1) 
  }

  const handleDeleteMultiple = () => {
    // setPaginatedData(paginatedData.filter((product) => {
    //   return !selectedRows.includes(product.id)
    // }))
    const processedData = deleteResult.filter((product) => {
        return !selectedRows.includes(product.id)
      })
    setCheckboxStyle({...checkboxStyle, visibility:'hidden'})
    setSelectedRows([])
    setDeleteResult(processedData)
    paginateData(processedData)
  }

  // 6. PAGINATION:
  const handlePrev = ()=>{
    if(prev != 0){
    setPrev((prevState)=> prevState - 5)
    setNext((prevState)=> prevState - 5)
    }
  }

  const handleNext = ()=>{

    if(next < deleteResult.length){
    setPrev((prevState)=> prevState + 5)
    setNext((prevState)=> prevState + 5)
    }
  }

  const paginateData = (dataArray)=>{
    // console.log(dataArray)
    console.log(prev, next)
    setPaginatedData(dataArray.filter((el, index)=>{
       return index >=prev && index < next
    }))
  }
  


  return (
    <>
      <div>
        <div className='inputContainers'>
          <div style={{ flexBasis: '50%' }} className='searchContainer'>
            <label htmlFor='search'> Enter Name</label>
            <input type='text' name='search'
              onChange={handleSearchInput} />
            <button> Search </button>
          </div>
          <div style={{ flexBasis: '30%' }} className='filters'>
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
          <div style={{ flexBasis: '10%' }} className='resetSortImg'>
            <img src={resetSortIconSvg} alt='reset=sort' onClick={resetSort} />
          </div>
          <div style={{ flexBasis: '10%' }} className='selectMultipleBtn'>
            {!selectedRows.length ? (<button onClick={() => handleSelectClick()}> Select </button>) :
              (<button onClick={() => handleDeleteMultiple()}> Delete </button>)}
          </div>
        </div>
        <table className='tableContainer'>
          <thead>
            <tr>
              {
                headerKeys.map((key, idx) => {
                  if (key === 'title' || key === 'price') {
                    return <th key={idx}> {toCamelCase(key)}
                      <img src={sortIconSvg} alt="sort-icon"
                        onClick={() => { handleSortAdvanced(key) }} />
                    </th>
                  }
                  else {
                    return <th key={idx}> {toCamelCase(key)} </th>
                  }
                })
              }
              {/* <th>Product Id</th>
              <th>Title <img src={sortIconSvg} alt="sort-icon"
                onClick={()=>{handleSortAdvanced('title')}} /></th>
              <th>Category</th>
              <th>Price <img src={sortIconSvg} alt="sort-icon"
                onClick={()=>{handleSortAdvanced('price')}} /></th> */}
            </tr>
          </thead>
          <tbody>
            {
              paginatedData.sort(sortCallback).map((product) => {
                return (
                  <tr key={product.id}>
                    <td><input style={checkboxStyle}
                      type='checkbox' onClick={(e) => { handleCheckboxClick(e, product.id) }}
                    />
                      {" "}
                      {product.id}
                    </td>
                    <td>{product.title}</td>
                    <td>{product.category}</td>
                    <td>&nbsp; &nbsp; ${product.price} &nbsp; &nbsp; </td>
                    <td><img className='deleteImg' src={deleteIcon} alt='delete-icon'
                      onClick={() => handleDelete(product.id)} /></td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
        <div className='paginateButtons'>
        <button className='paginateBtn' onClick={handlePrev}> Prev </button>
        <button className='paginateBtn' onClick={handleNext}> Next </button>
        </div>
      </div>
    </>
  )
}

export default App
