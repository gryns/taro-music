import Taro, { Component } from '@tarojs/taro'
import { Provider } from '@tarojs/redux'
import store from './store'
import Index from './pages/index'

import './app.less'

import 'taro-ui/dist/style/index.scss' // 全局引入一次即可

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

class App extends Component {
	config = {
		pages: ['pages/index/index', 'pages/list/list', 'pages/mv/mv', 'pages/play/play'],
		window: {
			backgroundTextStyle: 'light',
			navigationBarBackgroundColor: '#fff',
			navigationBarTitleText: 'WeChat',
			navigationBarTextStyle: 'black'
		},
		tabBar: {
			list: [
				{
					pagePath: 'pages/index/index',
					text: '首页',
					iconPath: './icon/home.png',
					selectedIconPath: './icon/homed.png'
				},
				{
					pagePath: 'pages/list/list',
					text: '搜索',
					iconPath: './icon/list.png',
					selectedIconPath: './icon/listed.png'
				},
				{
					pagePath: 'pages/mv/mv',
					text: 'MV',
					iconPath: './icon/mv.png',
					selectedIconPath: './icon/mved.png'
				}
			]
		},
		requiredBackgroundModes: ['audio', 'location']
	}

	// 在 App 类中的 render() 函数没有实际作用
	// 请勿修改此函数
	render() {
		return (
			<Provider store={store}>
				<Index />
			</Provider>
		)
	}
}

Taro.render(<App />, document.getElementById('app'))
