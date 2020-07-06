import Taro , {Component} from "@tarojs/taro"
import { View, Audio } from '@tarojs/components'
import { getPlayMp3, getMusicLyric } from '@/api'
import { connect } from '@tarojs/redux'
import { AtAvatar } from 'taro-ui'
import './play.less'

const mapSatetToProps = (state) => ({
	storeMusicId: state.music.storeMusicId,
	storeMusicDetail: state.music.storeMusicDetail,
	storePlayList: state.music.storePlayList
})
const mapDisToProps = (dispatch) => ({
	handleStoreNewAudio: dispatch.music.handleStoreNewAudio
})

@connect(mapSatetToProps, mapDisToProps)
class Play extends Component {
	state = {
		bgMusicObj: null,
		plat: process.env.TARO_ENV,
		playBtn: false, // true 播放 ， false 暂停
		palyId: this.props.storeMusicId,
		audioSrc: '',
		setIsAddAnimate: false
	}

	// 获取 音乐MP3
	getMusicMp3 = async () => {
		const { palyId } = this.state
		try {
			const data = await getPlayMp3(palyId)
			this.setState({
				audioSrc: data.data[0].url
			})
			this.playMusic(data)
		} catch (error) {
			console.log(error)
		}
	}

	// 监听 bgMusic 的方法
	useBgMusicObj = () => {
		const { bgMusicObj, palyId } = this.state
		const { storePlayList } = this.props

		// 播放结束时
		bgMusicObj.onEnded(() => {
			const listIndex = storePlayList.indexOf(palyId)
			this.setState({
				playBtn: true,
				setIsAddAnimate: false
			})
			if (listIndex === storePlayList.length - 1) {
				// 最后一首
				this.setState({
					playBtn: true,
					setIsAddAnimate: true
				})
				bgMusicObj.pause()
			} else {
				const newId = storePlayList[listIndex + 1]
				this.setState(
					{
						palyId: newId,
						playBtn: false
					},
					() => {
						this.getMusicMp3()
					}
				)
			}
		})
	}

	// 创建实例
	playMusic = (data) => {
		const { playBtn, setIsAddAnimate, palyId } = this.state
		const { storeMusicDetail, storePlayList } = this.props
		const playIdIndex = storePlayList.indexOf(palyId)
		let bgMusic = Taro.getBackgroundAudioManager()
		this.watchBgMusicEv(bgMusic)
		this.setState(
			{
				playBtn: !playBtn,
				bgMusicObj: bgMusic,
				setIsAddAnimate: !setIsAddAnimate,
				name: storeMusicDetail[playIdIndex].name,

				songName: storeMusicDetail[playIdIndex].songName
			},
			() => {
				bgMusic.title = storeMusicDetail[playIdIndex].songName
				bgMusic.epname = storeMusicDetail[playIdIndex].songName
				bgMusic.singer = storeMusicDetail[playIdIndex].name
				// 设置了 src 之后会自动播放 , 可是支付宝 只支持 优酷的音频自动播放
				bgMusic.src = data.data[0].url

				// 播放
				bgMusic.play()

				//监听实例
				this.useBgMusicObj()
			}
		)
	}

	// 获取歌词
	getLyricData = async (id) => {
		try {
			const data = await getMusicLyric(id)
		} catch (error) {
			console.log(error)
		}
	}

	// 暂停 && 播放
	handlePlayOrPause = () => {
		const { playBtn, bgMusicObj, setIsAddAnimate } = this.state
		this.setState({
			playBtn: !playBtn,
			setIsAddAnimate: !setIsAddAnimate
		})
		const btnEv = playBtn ? 'pause' : 'play'
		bgMusicObj[btnEv]()
	}

	// 监听 背景音乐事件
	watchBgMusicEv = (bgMusic) => {
		// 监听暂停
		bgMusic.onPause(() => {
			this.setState({
				playBtn: false,
				setIsAddAnimate: false
			})
		})

		// 监听播放
		bgMusic.onPlay(() => {
			this.setState({
				playBtn: true,
				setIsAddAnimate: true
			})
		})

		// 监听上一首
		bgMusic.onPrev(() => this.leftRightFn('第', 'up'))

		// 监听下一首
		bgMusic.onPrev(() => this.leftRightFn('最后'))
	}

	// 上一首
	handleArrowleft = () => {
		this.leftRightFn('第', 'up')
	}

	// 下一首
	handleArrowRight = () => {
		this.leftRightFn('最后')
	}

	/**
	 * 上&下一首函数
	 * @params  text 提示文字
	 * @params count up:上 ， 默认 下
	 * **/
	leftRightFn = (text, count) => {
		const { palyId } = this.state
		const { storePlayList } = this.props
		let ListIndex = storePlayList.indexOf(palyId)
		const newIndex = count ? --ListIndex : ++ListIndex
		if (newIndex !== storePlayList.length - 1 && newIndex !== -1) {
			// !最后一首
			this.setState(
				{
					palyId: storePlayList[newIndex],
					playBtn: false,
					setIsAddAnimate: false
				},
				() => {
					this.getMusicMp3(storePlayList[newIndex])
				}
			)
		} else {
			Taro.showToast({
				title: `播放的${text}一首`
			})
		}
	}

	componentDidMount() {
		// 获取音频  id 167827
		const { storeMusicId } = this.props

		this.getMusicMp3()

		// 获取歌词
		this.getLyricData(storeMusicId)
	}

	render() {
		const { audioSrc, plat, playBtn, name, songName, setIsAddAnimate } = this.state
		return (
			<View className="play">
				<View className="lyric" onClick={this.handlePlayOrPause}>
					<View
						className={
							setIsAddAnimate
								? 'bgImg setAnimate animateRuning'
								: 'bgImg setAnimate animatePause'
						}
					>
						{plat !== 'h5' && (
							<Image
								className="imgbg"
								src="https://p1.music.126.net/EOSjfYkPfiuYeMjr83RtAQ==/109951164460512857.jpg"
							/>
						)}
						{plat === 'h5' && (
							<img
								className="imgbg"
								src="https://p1.music.126.net/EOSjfYkPfiuYeMjr83RtAQ==/109951164460512857.jpg"
								alt="头像"
							/>
						)}
						<View className="mark"></View>
					</View>
					{playBtn ? (
						<View className="play play_icon"></View>
					) : (
						<View className="pause play_icon"></View>
					)}
					<View className="name">{name}</View>
					<View className="title">{songName}</View>
				</View>
				<View className="showlyric"></View>
				<View className="videoControl">
					{audioSrc && plat === 'h5' && (
						<Audio poster="poster" name="name" author="author" id="setAudioId" src={audioSrc} />
					)}
					{plat !== 'h5' && (
						<View className="width70 at-row at-row__justify--center">
							<View className="at-col at-col-2" onClick={this.handleArrowleft}>
								<Image className="arrowIcon" src="../../images/left.png" alt="左" />
							</View>
							<View className="at-col at-col-2">
								<AtAvatar className="userImg" image="" circle />
							</View>
							<View className="at-col at-col-2" onClick={this.handleArrowRight}>
								<Image className="arrowIcon" src="../../images/right.png" alt="右" />
							</View>
						</View>
					)}
				</View>
			</View>
		)
	}
}
export default Play
