import { Swiper, SwiperItem, View } from '@tarojs/components'
import { ApiBannerData } from "@/api"
import './banner.less'
class BannerPage extends Taro.Component {

    state = {
        bannerData: []
    }


    // 获取banner 数据
    getBannerData = async () => {
        try {
            const params = {
                type: 1,
            }
            const data = await ApiBannerData(params);
            this.setState({
                bannerData: data.banners
            })
        } catch (error) {
            console.log(error);

        }
    }

    // 渲染banner
    renderBannerData = () => {
        const { bannerData } = this.state
        return bannerData.map(item => {
            return <SwiperItem key={item.bannerId}>
                <View>
                    {

                        process.env.TARO_ENV === "weapp" && <Image className="image" src={item.pic} alt="banner" />

                    }
                    {

                        process.env.TARO_ENV === "h5" && <img className="image" src={item.pic} alt="banner" />

                    }

                </View>
            </SwiperItem>
        })
    }

    componentDidMount() {
        this.getBannerData()
    }

    render() {
        return (
            <Swiper className="banner">
                {
                    this.renderBannerData()

                }
            </Swiper>
        )
    }
}
export default BannerPage