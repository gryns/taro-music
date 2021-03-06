import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import { AtSearchBar, AtList, AtListItem } from 'taro-ui'
import { searchMusic } from '@/api'
import LoadingPage from '@/components/PageLoading'
import { connect } from '@tarojs/redux'
import { transTime } from '@/filter/common.jsx'
import './list.less'
let inputVal = ''

// 防抖函数
// 防抖函数
function bubble(fn, wait = 500) {
	let timer = 0
	return function() {
		if (timer) clearTimeout(timer)
		timer = setTimeout(function() {
			fn.call(this, arguments)
		}, wait)
	}
}

const mapStateToProps = (state) => ({
	storeMusicId: state.music.storeMusicId,
	storeNewAudio: state.music.storeNewAudio
})

const mapStateDispatchToProps = (dispatch) => ({
	handleStoreMusic: dispatch.music.handleStoreMusic,
	handleStoreMusicDetail: dispatch.music.handleStoreMusicDetail,
	handleStorePlayList: dispatch.music.handleStorePlayList
})
@connect(mapStateToProps, mapStateDispatchToProps)
class List extends Component {
	config = {
		navigationBarTitleText: '列表',
		pullRefresh: true
	}

	state = {
		inputValue: '',
		listData: [],
		loading: false,
		current: 1,
		pageSize: 20,
		pullLoad: true
	}

	// 点击查询
	handleInputChange = (e) => {
		this.setState({
			inputValue: e
		})
		inputVal = e
	}

	handleBtnSearch = (e) => {
		const { handleStorePlayList } = this.props
		handleStorePlayList([])
		// 查询
		this.setState(
			{
				current: 1
			},
			() => {
				const { inputValue } = this.state
				this.getNewestData(inputValue)
			}
		)
	}

	// 获取最新数据
	getNewestData = async (name) => {
		const { handleStorePlayList, handleStoreMusicDetail } = this.props
		this.setState({
			loading: true,
			inputValue: name
		})
		let { current, pageSize } = this.state
		try {
			const params = {
				keywords: name,
				limit: pageSize,
				offset: current
			}
			const data = await searchMusic(params)
			this.setState({
				listData: data.result.songs
			})

			const songId = data.result.songs.map((item) => item.id)
			const songDetail = data.result.songs.map((item) => {
				return {
					name: item.artists[0].name,
					songName: item.name
				}
			})
			handleStoreMusicDetail(songDetail)
			handleStorePlayList(songId)
		} catch (error) {
			console.log(error)
		} finally {
			this.setState({
				loading: false,
				current: current + 1
			})
		}
	}

	// render 最新数据列表
	renderNewestData = () => {
		const { listData } = this.state
		return listData.map((item) => {
			return (
				<AtListItem
					title={item.name}
					key={item.id}
					note={item.artists[0].name}
					thumb={item.artists[0].img1v1Url}
					onClick={() => this.getListMusicId(item)}
					extraText={transTime(item.duration)}
				/>
				// <View key={item.id}>{item.name}</View>
			)
		})
	}

	// 滚动数据
	getScrollData = async () => {
		this.setState({
			loading: true
		})
		let { listData, current, pageSize } = this.state
		try {
			const params = {
				keywords: inputVal,
				limit: pageSize,
				offset: current
			}
			const data = await searchMusic(params)
			const newData = [...listData, ...data.result.songs]
			this.setState({
				listData: newData
			})
		} catch (error) {
			console.log(error)
		} finally {
			this.setState({
				loading: false,
				current: current + 1
			})
		}
	}

	// 点击跳转
	getListMusicId = (item) => {
		const { handleStoreMusic } = this.props

		handleStoreMusic(item.id)

		Taro.navigateTo({
			url: '/pages/play/play'
		})
	}

	// 下拉 触发
	handleFresherStart = () => {
		// Taro.startPullDownRefresh({
		// 	success: (res) => {
		// 		console.log("00",res)
		// 		Taro.stopPullDownRefresh()
		// 	},
		// 	fail: (error) => {
		// 		console.log(error)
		// 	},
		// 	complete: (lete) => {
		// 		// console.log(lete)
		// 	}
		// })
		this.setState({
			loading: true
		})

		setTimeout(() => {
			this.setState({
				pullLoad: false,
				loading: false
			})
		}, 2000)
	}

	// 停止
	handleFresherStop = () => {
		console.log('停止')
		this.setState({
			pullLoad: true
		})
	}

	// 开始下拉
	pullDownStart = bubble(function() {
		console.log(11)
	})
	componentDidMount() {
		// 获取 最新 数据
		this.getNewestData('许嵩')
		inputVal = '许嵩'
	}

	render() {
		const { inputValue, loading, pullLoad, startPull } = this.state
		const styles = startPull && {
			overflow: 'hiddle'
		}
		return (
			<View className="list">
				{/* <AtSearchBar
					actionName="搜一下"
					value={inputValue}
					onChange={this.handleInputChange}
					onActionClick={this.handleBtnSearch}
					className="search"
				/>
				<View style={{ height: '42px' }}></View> */}
				<ScrollView
					scrollY
					scrollWithAnimation
					scrollAnchoring
					scrollTop={0}
					lowerThreshold={100}
					upperThreshold={30}
					onScrollToLower={this.getScrollData}
					className="searchscroll"
					refresherEnabled
					refresherTriggered={pullLoad}
					onRefresherPulling={this.pullDownStart}
					onRefresherRefresh={this.handleFresherStart}
					onRefresherRestore={this.handleFresherStop}
				>
					<AtList>{this.renderNewestData()}</AtList>
					{/* {this.renderNewestData()} */}
				</ScrollView>
				{loading && <LoadingPage />}
			</View>
		)
	}
}
export default List
