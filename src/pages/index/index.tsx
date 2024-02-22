import { View, Text } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import './index.less'

export default function Index() {

  useLoad(() => {
    console.log('Page loaded.')
  })

  const jumpAction = (url) => {
    Taro.navigateTo({
      url
    })
  }

  return (
    <View className='index'>
      <Text>Hello world!</Text>
      <View className='index-btn' onClick={() => {jumpAction('/pages/poster/index')}}>生成海报</View>
    </View>
  )
}
