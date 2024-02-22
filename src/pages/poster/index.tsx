
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
  height: windowHeight + 'px',
}

console.log("canvasStyle", canvasStyle)

const configData = [{
  type: 'image',
  height: windowHeight,
  width: windowWidth,
  top: 0,
  left: 0,
  url: 'https://img-qn.51miz.com/preview/photo/00/01/52/65/P-1526580-ED16C5F0.jpg'
},
{
  type: 'text',
  height: windowHeight,
  width: windowWidth,
  top: 100,
  left: 20,
  str: '把值得做的坚持下去，再把坚持做的事努力做好，大家一起加油',
  limitWidth: windowWidth - 30,
  color: '#303133',
  fontSize: 20,
  fontWeight: 600,
  fontfamily: 'PingFangSC-Regular',
  lineHeight: 1.5
},
{
  type: 'image',
  height: 100,
  width: 100,
  top: 60,
  left: windowHeight * 0.5,
  url: 'https://imgweb.kejipro.cn/p3037/t10/201906/0d8be94a-fa06-4155-9105-75362cbf378f.png'
}]


export default function Poster() {
  const [scale, setScale] = useState(1)
  const [posterImg, setPosterImg] = useState('')

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
      .exec(async (res)=>{
          if (!res[0]) return
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

          await drawPoster(context, node)

      })
    })
  }, [])

  // 根据传入的配置文件画图
  const drawPoster = async (context, node) => {
    Taro.showLoading({title: '海报生成中'})
    for(let item of configData) {
      switch (item.type) {
        case 'image':
          await drawImage(context, node, item.url, item.top, item.left, item.width, item.height)
          break;
        case 'text': 
          drawText(context, item)
      }
    }

    Taro.canvasToTempFilePath({
      canvas: node,
      fileType: 'jpg',
      success(res) {
        Taro.hideLoading()
        setPosterImg(res.tempFilePath)
        console.log(res.tempFilePath);
      },
      fail(error) {
        console.log(error);
      }
    }, context)
    
  }

  /* 绘制图片 */
  const drawImage = (context, node, url, ...arg) => {
    return new Promise((resolve) => {
        const image = node.createImage()
        image.src = url
        image.onload = () => {
          context.drawImage(image, ...arg)
          resolve(url)
        }
    })
  }
  /* 绘制文字 */
  const drawText = (context, item) => {
    let {str, limitWidth, top, left, color, fontSize, fontWeight, fontFamily, lineHeight} = item
    let lineWidth = 0
    let lastSubStrIndex = 0;
    /* 设置文字样式 */
    context.fillStyle = color
    context.font = `normal ${fontWeight} ${fontSize}px  ${fontFamily}`
    for (let i = 0; i < str.length; i++) {
      lineWidth += context.measureText(str[i]).width
      if (lineWidth > limitWidth) { /* 换行 */
        context.fillText(str.substring(lastSubStrIndex, i), left, top)
        top += fontSize * lineHeight
        lineWidth = 0
        lastSubStrIndex = i
      }
      if (i == str.length - 1) {  /* 无需换行 */
        context.fillText(str.substring(lastSubStrIndex, i + 1), left, top)
      }
    }
  }

  // 保存图片至本地
  const saveToAlbum = () => {
    Taro.saveImageToPhotosAlbum({
      filePath: posterImg,
      success: () => {
        Taro.showToast({
          title: '保存成功',
          icon: 'none',
          duration: 2000,
        });
      },
      fail: (err) => {
        if (err.errMsg == 'saveImageToPhotosAlbum:fail cancel') {
          return false
        } else {
          Taro.showModal({
            title: '提示',
            content: '需要您授权保存相册',
            showCancel: false,
            success: () =>{
              Taro.openSetting({
                success: (settingdata) => {
                  if (settingdata.authSetting['scope.writePhotosAlbum']) {
                    Taro.showModal({
                      title: '提示',
                      content: '获取权限成功,再次保存图片即可成功',
                      showCancel: false,
                    })
                  } else {
                    Taro.showModal({
                      title: '提示',
                      content: '获取权限失败，无法保存到相册',
                      showCancel: false,
                    })
                  }
                }
              })
            }
          })
        }
      }
    })
  }

  return (
    <View className='poster' style={canvasStyle}>
      { !posterImg &&<Canvas type='2d' id='myCanvas' canvasId='myCanvas' style={canvasStyle} className='poster-canvas' />}
      { posterImg && <Image src={posterImg} style={canvasStyle} />}
      { posterImg && <View className='poster-save' onClick={saveToAlbum}>保存到相册</View> }
    </View>
  )
}
