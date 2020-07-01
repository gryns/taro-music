import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'

import { add, minus, asyncAdd } from '@/actions/counter'

import './index.less'

import { searchMusic } from '@/api'

import BannerPage from './components/banner'
import RecommendPage from './components/recommend'

@connect(
	({ counter }) => ({
		counter
	}),
	(dispatch) => ({
		add() {
			dispatch(add())
		},
		dec() {
			dispatch(minus())
		},
		asyncAdd() {
			dispatch(asyncAdd())
		}
	})
)
class Index extends Component {

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
				keywords: name
			}
			const data = await searchMusic(params)
			this.setState({
				listData: data.result.songs,
				dataLoading: false
			})
		} catch (error) {
			console.log(error)
		}
	}

	render() {
		return (
			<View className="index">
				<BannerPage />
				<View className="h4">热门推荐</View>
				<RecommendPage />
			</View>
		)
	}
}

export default Index
