import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'

import { add, minus, asyncAdd } from '../../actions/counter'

import './index.less'

import {searchMusic} from "@/api"


@connect(({ counter }) => ({
  counter
}), (dispatch) => ({
  add () {
    dispatch(add())
  },
  dec () {
    dispatch(minus())
  },
  asyncAdd () {
    dispatch(asyncAdd())
  }
}))
class Index extends Component {

    config = {
    navigationBarTitleText: '首页'
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount () { }

  // 获取歌手的数据
  getMusicData = async (name) =>{
    try {
      const data = await searchMusic(name);
      console.log(data);
      
    } catch (error) {
      console.log(error);
    }
  }

  componentDidMount(){
    // 查询歌手
    // this.getMusicData("七年")
  }

  render () {
    return (
      <View className='index'>
        <Text>音乐播放器</Text>
      </View>
    )
  }
}

export default Index
