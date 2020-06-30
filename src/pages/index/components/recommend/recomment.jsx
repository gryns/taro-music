import { useState, useEffect } from '@tarojs/taro'
import { Swiper, SwiperItem, View } from '@tarojs/components'
import { recommendSong } from "@/api"
function Recommend() {

    const [bannerData, setBannerData] = useState([]);

    useEffect(() => {
        getRecommendData()
    }, [])


    // 获取推荐 数据
    const getRecommendData = async () => {
        try {
            const data = await recommendSong();
            console.log(data);
            
            setBannerData(data.banners)
        } catch (error) {
            console.log(error);

        }
    }

    // 渲染推荐数据
    const renderData = () => {
        if (bannerData.length && bannerData.length !== 0) {
            return bannerData.map(item => {
                return <SwiperItem key={item.bannerId}>
                    <View>
                        <img style={{width:"100%"}} src={item.pic} alt="banner"/>
                    </View>
                </SwiperItem>
            })
        }
    }

    return (
        <Swiper>
            {
                renderData()
            }
        </Swiper>
    )
}
export default Recommend