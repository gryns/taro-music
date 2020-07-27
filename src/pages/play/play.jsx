import Taro, { Component } from '@tarojs/taro'
import { View, Audio } from '@tarojs/components'
import { getPlayMp3, getMusicLyric } from '@/api'
import { connect } from '@tarojs/redux'
import { AtAvatar } from 'taro-ui'
import './play.less'
import { transSecond } from "@/filter/common"

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
	config = {
		navigationBarTitleText: '播放',
	}
	state = {
		bgMusicObj: null,
		plat: process.env.TARO_ENV,
		playBtn: false, // true 播放 ， false 暂停
		palyId: this.props.storeMusicId,
		audioSrc: '',
		setIsAddAnimate: false,
		lyricText: [],
		minuteNum: []
	}

	// 获取 音乐MP3
	getMusicMp3 = async () => {
		const { palyId } = this.state
		clearInterval(this.timer)
		try {
			const data = await getPlayMp3(palyId)

			// 歌词
			this.getLyricData(palyId)

			this.setState(
				{
					audioSrc: data.data[0].url
				},
				() => {
					// 非 h5
					if (process.env.TARO_ENV !== 'h5') {
						this.playMusic(data)
					} else {
						this.audioH5 = document.getElementById('setAudioId')
						// h5 事件函数
						this.h5EventFn()
					}
				}
			)
		} catch (error) {
			console.log(error)
		}
	}

	// h5 事件
	h5EventFn = () => {
		const { palyId, playBtn, setIsAddAnimate } = this.state
		const { storeMusicDetail, storePlayList } = this.props
		const playIdIndex = storePlayList.indexOf(palyId)
		// const playIdIndex = '167937'

		// 播放
		this.audioH5.play()

		// 播放 监听
		this.audioH5.onplay = () => {
			console.log('play')
			this.watchSongTime()
		}

		// 暂停 监听
		this.audioH5.onpause = () => {
			console.log('pause')
		}

		// 设置 歌手和歌曲
		this.setState({
			name: storeMusicDetail[playIdIndex].name,
			songName: storeMusicDetail[playIdIndex].songName,
			// name: '111',
			// songName: '222',
			playBtn: !playBtn,
			setIsAddAnimate: !setIsAddAnimate
		})
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
				console.log(bgMusic)

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
			const lyr = data.lrc.lyric

			let time = lyr.split(']')
			const txt = time.map((item) => {
				const text = item.split('[')[0]
				return text
			})

			const minute = time.map((item) => {
				const hour = item.split('[')[1]
				return hour
			})

			console.log(minute)

			this.setState({
				lyricText: txt,
				minuteNum: minute
			})
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
		if (process.env.TARO_ENV === 'h5') {
			this.audioH5[btnEv]()
		} else {
			bgMusicObj[btnEv]()
		}
		clearInterval(this.timer)
	}

	// 实时监听 歌曲进度
	watchSongTime = (bgMusic) => {
		this.timer = setInterval(() => {
			if (process.env.TARO_ENV === 'h5') {
				const time = this.audioH5.currentTime
				transSecond(time)

				this.setState({
					activeClass: transSecond(time)
				})

			} else {
				console.log(bgMusic.currentTime)
			}
		}, 1000)
	}

	// 监听 背景音乐事件
	watchBgMusicEv = (bgMusic) => {
		// 监听暂停
		bgMusic.onPause(() => {
			this.setState({
				playBtn: false,
				setIsAddAnimate: false
			})
			clearInterval(this.timer)
		})

		// 监听播放
		bgMusic.onPlay(() => {
			this.setState({
				playBtn: true,
				setIsAddAnimate: true
			})

			this.watchSongTime(bgMusic)
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

	// 渲染歌词
	renderLyric = () => {
		const { lyricText, minuteNum, activeClass } = this.state
		return lyricText.map((item, index) => {
			// const minute = minuteNum[index] && minuteNum[index].substr(0, 5)
			// const active = activeClass === minute ? 'view active' : 'view'
			return (
				<View>
					{item}
				</View>
			)
		})
	}

	componentDidMount() {
		// 获取音频  id 167827
		const { storeMusicId } = this.props

		this.getMusicMp3()

		// 获取歌词
		this.getLyricData(storeMusicId)
	}

	componentWillUnmount() {
		clearInterval(this.timer)
	}

	render() {
		const { audioSrc, plat, playBtn, name, songName, setIsAddAnimate, lyricText } = this.state
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
					<View className="name">
						{name}---{songName}
					</View>
				</View>
				<View className="showlyric">
					<View className="scroll-div">{this.renderLyric()}</View>
				</View>
				<View className="videoControl">
					{audioSrc && plat === 'h5' && <Audio controls={false} id="setAudioId" src={audioSrc} />}
					<View className="width70 at-row at-row__justify--center">
						<View className="at-col at-col-2 leftImg" onClick={this.handleArrowleft}></View>
						<View className="at-col at-col-2">
							<AtAvatar className="userImg" image="" circle />
						</View>
						<View className="at-col at-col-2 rightImg" onClick={this.handleArrowRight}></View>
					</View>
				</View>
			</View>
		)
	}
}
export default Play
