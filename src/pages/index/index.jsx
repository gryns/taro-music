import { Component } from '@tarojs/taro'
import { View, Picker } from '@tarojs/components'

import './index.less'

import { searchMusic } from '@/api'

import BannerPage from './components/banner'
import RecommendPage from './components/recommend'

import { AtList, AtListItem } from "taro-ui"

class Index extends Component {

	config = {
		navigationBarTitleText: '首页'
	}

	state = {
		dataList: [
			{
				name: "姓氏",
				id: 1001,
				children: [
					{
						name: "高",
						id: 10011
					},
					{
						name: "牛",
						id: 10012
					}
				]
			},
			{
				name: "名字",
				id: 1002,
				children: [
					{
						name: "有新",
						id: 10021
					},
					{
						name: "双双",
						id: 10022
					}
				]
			}
		],
		selected: [],
		value: [],
		selectData: [],

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

	// render picker
	renderListData = () => {
		const { dataList, selected, value } = this.state
		return dataList.map((item, index) => {
			return <Picker mode='selector' value={value[index]} rangeKey="name" range={item.children} onChange={(e) => this.onChange(e, item.children, index)}>
				<AtList>
					<AtListItem
						title={item.name}
						extraText={selected[index] || "未选择"}
					/>
				</AtList>
			</Picker>
		})
	}

	onChange = (ev, item, index) => {
		let { selected , value } = this.state
		const pickerEd = item[ev.detail.value].name
		selected[index] = pickerEd
		value[index] = ev.detail.value
		this.setState({
			selected,
			value
		})
	}

	render() {
		const { selected, selectData } = this.state
		return (
			<View className="index">
				<BannerPage />
				<View className="h4">热门推荐</View>
				<RecommendPage />
				{
					this.renderListData()
				}
			</View>
		)
	}
}

export default Index
