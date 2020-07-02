import { View, ScrollView } from '@tarojs/components'
import { AtSearchBar, AtList, AtListItem } from 'taro-ui'
import { searchMusic } from '@/api'
import LoadingPage from '@/components/PageLoading'
import { connect } from '@tarojs/redux'
import './list.less'
let inputVal = ''

const mapStateToProps = (state) => ({
	storeMusicId: state.music.storeMusicId,
	storeNewAudio: state.music.storeNewAudio
})

const mapStateDispatchToProps = (dispatch) => ({
	handleStoreMusic: dispatch.music.handleStoreMusic,
	handleStoreMusicDetail: dispatch.music.handleStoreMusicDetail
})
@connect(mapStateToProps, mapStateDispatchToProps)
class List extends Taro.Component {
	config = {
		navigationBarTitleText: '列表'
	}

	state = {
		inputValue: '',
		listData: [],
		loading: false,
		current: 1,
		pageSize: 20
	}

	// 点击查询
	handleInputChange = (e) => {
		this.setState({
			inputValue: e
		})
		inputVal = e
	}

	handleBtnSearch = (e) => {
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
				/>
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

	getListMusicId = (item) => {
		const { handleStoreMusic, storeNewAudio, handleStoreMusicDetail } = this.props
		if (storeNewAudio) {
			storeNewAudio.destroy()
		}
		handleStoreMusic(item.id)
		handleStoreMusicDetail(item.artists[0])
		Taro.navigateTo({
			url: '/pages/play/play'
		})
	}

	componentDidMount() {
		// 获取 最新 数据
		this.getNewestData('许嵩')
		inputVal = '许嵩'
	}

	render() {
		const { inputValue, loading } = this.state
		return (
			<View className="list">
				<AtSearchBar
					actionName="搜一下"
					value={inputValue}
					onChange={this.handleInputChange}
					onActionClick={this.handleBtnSearch}
					className="search"
				/>
				<View style={{ height: '42px' }}></View>
				<ScrollView
					scrollY
					scrollWithAnimation
					scrollTop={0}
					lowerThreshold={0}
					upperThreshold={30}
					onScrollToLower={this.getScrollData}
					className="searchScroll"
				>
					<AtList>{this.renderNewestData()}</AtList>
				</ScrollView>
				{loading && <LoadingPage />}
			</View>
		)
	}
}
export default List
