import { AtToast } from 'taro-ui'
function PageLoading() {
	return <AtToast text="加载中..." status="loading" duration={0} hasMask isOpened />
}
export default PageLoading
