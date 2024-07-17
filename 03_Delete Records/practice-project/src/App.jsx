import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'
import clearFilterSvg from './assets/clearFilterSvg.svg'
import sortIconSvg from './assets/sortIconSvg.svg'
import resetSortIconSvg from './assets/resetSortIconSvg.svg'
import deleteIcon from './assets/deleteIcon.svg'

function App() {
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [isFilterSelected, setIsFilterSelected] = useState(false)
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [isPriceSortAscending, setIsPriceSortAscending] = useState(true)
  const [isTitleSortAscending, setIsTitleSortAscending] = useState(true)
  const [sortCallback, setSortCallback] = useState(() => () => { })
  const [headerKeys, setHeaderKeys] = useState([])
  const [checkboxStyle, setCheckboxStyle] = useState({})
  const [selectedRows, setSelectedRows] = useState([])

  useEffect(() => {
    axios.get('https://dummyjson.com/products')
      .then((res) => {
        setData(res.data.products);
        setFilteredData(res.data.products);
      });
  }, [sortCallback])

  useEffect(() => {
    if (data && data.length > 0) {
      addCategories(data)
      getHeaderKeys(data);
    }
    setCheckboxStyle(getCheckboxStyles())
  }, [data])

  
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
    setIsPriceSortAscending(true);
    setIsTitleSortAscending(true)
    setSortCallback(() => () => { })

  }

  // 4. DELETE:
  const handleDelete = (id) => {
    setFilteredData(filteredData.filter((product) => {
      return product.id !== id
    }))
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
  }

  const handleDeleteMultiple = () => {
    setFilteredData(filteredData.filter((product) => {
      return !selectedRows.includes(product.id)
    }))
    setCheckboxStyle({...checkboxStyle, visibility:'hidden'})
    setSelectedRows([])
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
            </tr>
          </thead>
          <tbody>
            {
              filteredData.sort(sortCallback).map((product) => {
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
      </div>
    </>
  )
}

export default App
