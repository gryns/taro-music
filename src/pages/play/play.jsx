import { View, Audio, Button } from '@tarojs/components'
import { getPlayMp3, musicDetail, getMusicLyric } from '@/api'
import { connect } from '@tarojs/redux'
import './play.less'

const mapSatetToProps = (state) => ({
	storeMusicId: state.music.storeMusicId,
	storeMusicDetail: state.music.storeMusicDetail
})
const mapDisToProps = (dispatch) => ({
	handleStoreNewAudio: dispatch.music.handleStoreNewAudio
})

@connect(mapSatetToProps, mapDisToProps)
class Play extends Taro.Component {
	state = {
		audioSrc: '',
		wxAudio: null,
		plat: process.env.TARO_ENV
	}

	getMusicMp3 = async () => {
		const { storeMusicId, handleStoreNewAudio } = this.props
		const { plat } = this.state
		try {
			const data = await getPlayMp3(storeMusicId)
			const dataObj = data.data[0]
			// wx做法
			// 创建一个实例
			let newAudio = null
			if (plat === 'weapp') {
				newAudio = Taro.createInnerAudioContext()
				newAudio.src = dataObj.url
				handleStoreNewAudio(newAudio)
			}

			this.setState({
				audioSrc: dataObj.url,
				wxAudio: plat === 'weapp' && newAudio
			})
		} catch (error) {
			console.log(error)
		}
	}

	playMusic = () => {
		const { wxAudio } = this.state
		wxAudio.play()
	}

	// 获取歌词
	getLyricData = async (id) => {
		try {
			const data = await getMusicLyric(id)
		} catch (error) {
			console.log(error)
		}
	}

	// 获取详情
	getDetailData = async (id) => {
		try {
			const data = await musicDetail(id)
		} catch (error) {
			console.log(error)
		}
	}

	componentDidMount() {
		// 获取音频  id 167827
		const { storeMusicId } = this.props
		this.getMusicMp3()

		// 获取歌词
		this.getLyricData(storeMusicId)

		// 获取详情
		// this.getDetailData(storeMusicId)
	}

	render() {
		const { audioSrc, plat } = this.state
		const { storeMusicDetail } = this.props
		return (
			<View className="play">
				<View className="lyric">
					{plat === 'weapp' && (
						<Image className="imgbg" src={storeMusicDetail.img1v1Url || storeMusicDetail.pic} />
					)}
					{plat === 'h5' && (
						<img
							className="imgbg"
							src={storeMusicDetail.img1v1Url || storeMusicDetail.pic}
							alt="头像"
						/>
					)}
				</View>
				<View className="videoControl">
					{audioSrc && plat !== 'weapp' && (
						<Audio poster="poster" name="name" author="author" id="setAudioId" src={audioSrc} />
					)}
					{plat === 'weapp' && (
						<Button type="primary" onClick={this.playMusic}>
							播放音乐
						</Button>
					)}
				</View>
			</View>
		)
	}
}
export default Play
