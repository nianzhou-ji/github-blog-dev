import React from "react";

import CommonStore from "./commonStore/commonStore";


class RootStore {
    constructor() {
        this.commonStore = new CommonStore(this)
    }
}

// 导入useStore方法供组件使用数据
const StoresContext = React.createContext(new RootStore())
const useStore = () => React.useContext(StoresContext)
//后面直接导入useStore，可以通过解引用的方式拿到store对象
export {useStore}
