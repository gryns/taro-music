import { View } from "@tarojs/components"
import { AtSearchBar, AtList, AtListItem } from "taro-ui";
import { newestSong } from "@/api"
import LoadingPage from "@/components/PageLoading"
import "./list.less"
class List extends Taro.Component {
    config = {
        navigationBarTitleText: "列表"
    }

    state = {
        inputValue: "",
        listData: [],
        loading: false
    }

    handleInputChange = (e) => {
        this.setState({
            inputValue: e
        })
    }

    handleBtnSearch = () => {

    }

    // 获取最新数据
    getNewestData = async () => {
        this.setState({
            loading: true
        })
        try {
            const params = {
                type: 0,
            }
            const data = await newestSong(params)
            this.setState({
                listData: data.data.slice(0, 20)
            })
        } catch (error) {
            console.log(error);

        } finally {
            this.setState({
                loading: false
            })
        }
    }

    // render 最新数据列表
    renderNewestData = () => {
        const { listData } = this.state
        return listData.map(item => {
            return <AtListItem title={item.name} key={item.id} />
        })
    }

    componentDidMount() {
        // 获取 最新 数据
        this.getNewestData()
    }

    render() {
        const { inputValue, loading } = this.state
        return (
            <View className="list">
                <AtSearchBar
                    actionName='搜一下'
                    value={inputValue}
                    onChange={this.handleInputChange}
                    onActionClick={this.handleBtnSearch}
                    className="search"
                />
                <View style={{ height: "42px" }}></View>
                <AtList>
                    {this.renderNewestData()}
                </AtList>
                {
                    loading && <LoadingPage />
                }
            </View>

        )
    }
}
export default List;