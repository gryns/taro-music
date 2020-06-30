import {View } from "@tarojs/components"
import {AtButton} from "taro-ui";
class List extends Taro.Component{
    config={
        navigationBarTitleText:"列表"
    }
    render(){
        return(
            <View>
                <View>列表</View>
                <AtButton loading  type="primary">按钮</AtButton>
            </View>
            
        )
    }
}
export default List;