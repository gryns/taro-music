import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'

import { add, minus, asyncAdd } from '@/actions/counter'

import './index.less'

import { searchMusic } from "@/api"
import { AtSearchBar, AtList, AtListItem, AtToast } from 'taro-ui'

import BannerPage from "./components/banner"


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
    searchValue: "",
    listData: [],
    dataLoading: false,
  }

  config = {
    navigationBarTitleText: '首页'
  }

  // 获取歌手的数据
  getMusicData = async (name) => {
    this.setState({
      dataLoading: true
    })
    try {
      const params = {
        keywords: name,
      }
      const data = await searchMusic(params);
      this.setState({
        listData: data.result.songs,
        dataLoading: false
      })
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
    this.getMusicData("七年")
  }

  // 渲染列表数据
  renderListData = () => {  
    const { listData } = this.state;
    if (listData.length === 0) return null;
    return listData.map(item => {
      return <AtListItem key={item.id} title={item.name} />
    })
  }

  // 查询歌手
  handleSearch = () => {
    const { searchValue } = this.state;
    this.getMusicData(searchValue);
  }

  handleLick = () => {
    Taro.switchTab({
      url: "/pages/list/list"
    })
  }

  render() {
    const { searchValue, dataLoading } = this.state
    return (
      <View className='index'>
        <AtSearchBar
          showActionButton
          value={searchValue}
          onChange={this.handleChange}
          onActionClick={this.handleSearch}
          className="search"
        />
        <View style={{ height: "42px" }}></View>
        <BannerPage />
        <AtList>
          {this.renderListData()}
        </AtList>
        {
          dataLoading && <AtToast text="加载中..." status="loading" duration={0} isOpened={dataLoading} />
        }

      </View>
    )
  }
}

export default Index
