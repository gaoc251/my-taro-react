
import React, {useEffect, useState} from 'react'
import { View, Button } from '@tarojs/components'

const useTableHooks = (requestFn) => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(1)
  const [total, setTotal] = useState(0)

  const loadData = (currentVal?) => {
    setLoading(true)
    requestFn(currentVal)
      .then(res =>{
        const {list, total} = res
        setDataSource(list)
        setTotal(total)
        setLoading(false)
      })
      .catch((err) => {
        setLoading(false)
      })
  }

  useEffect(()=>{
    loadData()
  }, [])

  const onTableChange = (value) =>{
    setCurrent(value.current)
    loadData(value.current)
  }


  return [
    dataSource, 
    loading,
    current, 
    total,
    onTableChange
  ]
}

const getTableData = (current = 0, pageSize = 3) => {
  const dataSource = ['2','1']
  const total = 20;
  return new Promise((resolve, reject) => {
    resolve({
      list: dataSource,
      total: total
    })
  })
}

const TabHooks = () => {
  const [
    dataSource,
    onTableChange,
    current,
    loading,
    total
  ] = useTableHooks(getTableData)

  return (
    <View
      loading={loading}
      dataSource={dataSource}
      onChange={onTableChange}
      pagination={{
        current,
        total
      }}
    ></View>
  )
}

export default TabHooks;

// import { View, Text } from '@tarojs/components'
// import { useLoad } from '@tarojs/taro'
// import './index.less'

// export default function Index() {

//   useLoad(() => {
//     console.log('Page loaded.')
//   })

//   return (
//     <View className='index'>
//       <Text>Hello world!</Text>
//     </View>
//   )
// }
