
/**
 * 海报分享
 * 背景图，二维码等信息绘制在一张图中，动态获取
 */
import { View, Image, Canvas } from '@tarojs/components'
import Taro, { useDidShow, useLoad } from '@tarojs/taro'
import { useEffect, useState } from 'react'
import './index.less'

const { windowHeight, windowWidth, pixelRatio } = Taro.getSystemInfoSync() /* 动态获取设备的宽和高  */

const canvasStyle = {
  width: windowWidth + 'px',
  height: windowHeight + 'px'
}

export default function Poster() {
  // const [isDraw, setIsDraw] = useState(false); // 是否开始绘制海报
  // const [configData, setConfigData] = useState({}); // 海报配置信息

  

  const [scale, setScale] = useState(1)

  useLoad(() => {
    console.log('Page loaded.')
  })

  useEffect(() => {
    Taro.nextTick(()=>{
      const query = Taro.createSelectorQuery()
      query.select('#myCanvas')
      .fields({
          node: true,
          size: true
      })
      .exec((res)=>{
          const { node } = res[0]
      
          if (!node) return
          /* 第一步: canvas 画布的宽高 和 元素的宽高 必须保持相同的长宽比列,否则会变形 */
          const dpr = pixelRatio
          const context = node.getContext('2d')
          node.width = windowWidth * dpr
          node.height = windowHeight * dpr
          context.scale(dpr, dpr)
          context.fillStyle = '#999'
          context.fillRect(0, 0, windowWidth, windowHeight)

          drawImage(context, node, 'https://img-qn.51miz.com/preview/photo/00/01/52/65/P-1526580-ED16C5F0.jpg', 0, 0, 300, 300)

          drawImage(context, node, 'https://imgweb.kejipro.cn/p3037/t10/201906/0d8be94a-fa06-4155-9105-75362cbf378f.png', 0, 270, 100, 100)
      })
    })
  }, [])

  /* 绘制图片 */
  const drawImage = (context, node, url, ...arg) => {
    return new Promise((resolve) => {
        const image = node.createImage()
        image.src = url
        image.onload = () => {
          context.drawImage(image, ...arg)
        }
    })
  }

  /* 获取元素位置 */
  const geDomPostion = (dom, isAll) => {
    return new Promise((resolve) => {
      Taro.createSelectorQuery().select(dom).boundingClientRect(rect => {
        debugger
        const { top, left } = rect
          /* isAll 是否获取设备宽高等信息 */
          resolve(isAll ? rect : {
              top,
              left
          })
      }).exec()
    })
  }

  return (
    <View className='poster'>
      11111
      <Canvas type='2d' id='myCanvas' canvasId='myCanvas' style={canvasStyle} />
    </View>
  )
}
