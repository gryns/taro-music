import { recommendSong } from '@/api'
import { View, Text } from '@tarojs/components'
import './index.less'
import 'taro-ui/dist/style/components/flex.scss'
import LoadingPage from '@/components/PageLoading'
import { connect } from '@tarojs/redux'
import Taro , {Component} from "@tarojs/taro"

const mapStateToProps = (state) => ({
	storeMusicId: state.music.storeMusicId,
	storeNewAudio: state.music.storeNewAudio
})

const mapStateDispatchToProps = (dispatch) => ({
	handleStoreMusic: dispatch.music.handleStoreMusic,
	handleStoreMusicDetail: dispatch.music.handleStoreMusicDetail
})
@connect(mapStateToProps, mapStateDispatchToProps)
class Recommend extends Component {
	state = {
		loading: false,
		listData: []
	}

	// 获取推荐 数据
	getRecommendData = async () => {
		this.setState({
			loading: true
		})
		try {
			const params = {
				limit: 9
			}
			const data = await recommendSong(params)
			this.setState({
				listData: data.result
			})
		} catch (error) {
			console.log(error)
		} finally {
			this.setState({
				loading: false
			})
		}
	}

	// 渲染推荐数据
	renderListData = () => {
		const { listData } = this.state
		return listData.map((item) => {
			return (
				<View
					className="at-col at-col-4 view-flex"
					key={item.id}
				>
					<View>
						{process.env.TARO_ENV !== 'h5' && (
							<Image className="image" src={item.picUrl} alt="图片" />
						)}
						{process.env.TARO_ENV === 'h5' && (
							<img className="image" src={item.picUrl} alt="图片" />
						)}
					</View>
					<View>
						<Text className="textOverflow">{item.name}</Text>
					</View>
				</View>
			)
		})
	}

	// 跳转播放页面
	getCurrentData = (item) => {
		const { handleStoreMusic, storeNewAudio, handleStoreMusicDetail } = this.props
		if (storeNewAudio) {
			storeNewAudio.destroy()
		}
		handleStoreMusic(item.id)
		handleStoreMusicDetail(item)
		Taro.navigateTo({
			url: '/pages/play/play'
		})
	}

	componentDidMount() {
		// 获取推荐数据
		this.getRecommendData()
	}

	render() {
		const { loading } = this.state
		return (
			<View>
				<View className="at-row at-row--wrap at-row__justify--around">{this.renderListData()}</View>
				{loading && <LoadingPage />}
			</View>
		)
	}
}
export default Recommend
