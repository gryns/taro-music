import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'

import { add, minus, asyncAdd } from '@/actions/counter'

import './index.less'

import { searchMusic } from "@/api"
import { AtSearchBar } from 'taro-ui'


@connect(({ counter }) => ({
  counter
}), (dispatch) => ({
  add() {
    dispatch(add())
  },
  dec() {
    dispatch(minus())
  },
  asyncAdd() {
    dispatch(asyncAdd())
  }
}))
class Index extends Component {

  state = {
    searchValue: ""
  }

  config = {
    navigationBarTitleText: '首页'
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps)
  }

  // 获取歌手的数据
  getMusicData = async (name) => {
    try {
      const data = await searchMusic(name);
      console.log(data);

    } catch (error) {
      console.log(error);
    }
  }

  // input onchange
  handleChange = (value) => {
    this.setState({
      searchValue: value
    })
  }

  componentDidMount() {
    // 查询歌手
    // this.getMusicData("七年")
  }

  handleSearch = () => {
    const { searchValue } = this.state;
    this.getMusicData(searchValue);
  }

  render() {
    const { searchValue } = this.state
    return (
      <View className='index'>
        <AtSearchBar
          showActionButton
          value={searchValue}
          onChange={this.handleChange}
          onActionClick={this.handleSearch}
        />
      </View>
    )
  }
}

export default Index
