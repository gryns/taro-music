const musci = {
	state: {
		storeMusicId: 167827,
		storeNewAudio: null,
		storeMusicDetail: null,
		storePlayList: []
	},
	reducers: {
		// 事件
		handleStoreMusic(state, payload) {
			return {
				...state,
				storeMusicId: payload
			}
		},

		// 音频实例
		handleStoreNewAudio(state, payload) {
			return {
				...state,
				storeNewAudio: payload
			}
		},

		// 歌曲详情
		handleStoreMusicDetail(state, payload) {
			return {
				...state,
				storeMusicDetail: payload
			}
		},

		// 获取播放列表
		handleStorePlayList(state, payload) {
			return {
				...state,
				storePlayList: payload
			}
		}
	},
	effect: () => {
		// async getMenuData() {
		//     const menuData = await menu();
		// 	dispatch.asideMenu.menu(menuData.list);
		// }
	}
}

export default musci
