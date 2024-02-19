
import React, {useEffect, useState} from 'react'
import { View, Button, Text } from '@tarojs/components'

const useContent = (id) => {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('')

  useEffect(()=>{
    setLoading(true)
    setTimeout(()=>{
      const message = ['sddsadasdasdsa', '2','3']
      setLoading(false)
      setMsg(message[id])
    }, 100)
  }, [id])

  return [loading, msg]
}

const Content = ({id})=>{
  const [loading, msg] = useContent(id)
  return <View>{loading? <Text>loading...</Text>:<View>{msg}</View>}</View>
}

const TabHooks = () => {
  const [id, setId] = useState(0)
  return (
    <View>
      <Button onClick={()=>{setId(0)}}>点击0</Button>
      <Button onClick={()=>{setId(1)}}>点击1</Button>
      <Button onClick={()=>{setId(2)}}>点击2</Button>
      <Content id={id} />
    </View>
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
