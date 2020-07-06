import { Swiper, SwiperItem, View } from '@tarojs/components'
import Taro, { Component } from '@tarojs/taro'
import { ApiBannerData } from '@/api'
import './banner.less'
import { connect } from '@tarojs/redux'
const mapStateToProps = (state) => ({
	storeMusicId: state.music.storeMusicId,
	storeNewAudio: state.music.storeNewAudio
})

const mapStateDispatchToProps = (dispatch) => ({
	handleStoreMusic: dispatch.music.handleStoreMusic,
	handleStoreMusicDetail: dispatch.music.handleStoreMusicDetail
})
@connect(mapStateToProps, mapStateDispatchToProps)
class BannerPage extends Component {
	state = {
		bannerData: []
	}

	// 获取banner 数据
	getBannerData = async () => {
		try {
			const params = {
				type: 1
			}
			const data = await ApiBannerData(params)
			this.setState({
				bannerData: data.banners
			})
		} catch (error) {
			console.log(error)
		}
	}

	// 渲染banner
	renderBannerData = () => {
		const { bannerData } = this.state
		return bannerData.map((item) => {
			return (
				<SwiperItem key={item.bannerId}>
					<View>
						{process.env.TARO_ENV !== 'h5' && (
							<Image className="image" src={item.pic} alt="banner" />
						)}
						{process.env.TARO_ENV === 'h5' && (
							<img className="image" src={item.pic} alt="banner" />
						)}
					</View>
				</SwiperItem>
			)
		})
	}

	// 跳转播放页面
	getCurrentData = (item) => {
		const { handleStoreMusic, storeNewAudio, handleStoreMusicDetail } = this.props
		if (storeNewAudio) {
			storeNewAudio.destroy()
		}
		handleStoreMusic(item.targetId)
		handleStoreMusicDetail(item)
		Taro.navigateTo({
			url: '/pages/play/play'
		})
	}

	componentDidMount() {
		this.getBannerData()
	}

	render() {
		return (
			<Swiper className="banner" autoplay={true}>
				{this.renderBannerData()}
			</Swiper>
		)
	}
}
export default BannerPage
