
import { init } from "@rematch/core"
import music from "./models/music"
const store = init({
  models: {
    music
  }

})
export default store