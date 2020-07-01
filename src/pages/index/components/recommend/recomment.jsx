import { recommendSong } from '@/api'
import { AtToast } from 'taro-ui'
import { View, Text } from '@tarojs/components'
import './index.less'
import 'taro-ui/dist/style/components/flex.scss'
import LoadingPage from "@/components/PageLoading"
class Recommend extends Taro.Component {
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
			console.log(data)
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
				<View className="at-col at-col-4 view-flex" key={item.id}>
					<View>
						{process.env.TARO_ENV === 'weapp' && (
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
