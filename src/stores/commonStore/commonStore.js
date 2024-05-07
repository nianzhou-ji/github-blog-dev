import {makeAutoObservable} from "mobx";
import _ from "lodash";


class CommonStore {

    profileSize = {}


    updateProfileSize(value) {
        this.profileSize = value
    }

    profileConfig = {}

    updateProfileConfig(value){
        this.profileConfig = value

    }


    detectDeviceType() {
        const userAgent = navigator.userAgent.toLowerCase();
        const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(userAgent);
        return isMobile ? 'Mobile' : 'Desktop';
    }


    // 每分钟
    averageReadVelocity = 250

    convertMinutesToHMS(minutes) {
        const hours = Math.floor(minutes / 60);  // 计算小时数
        const remainingMinutes = Math.floor(minutes % 60);  // 计算剩余分钟数
        const seconds = Math.floor((minutes * 60) % 60);  // 计算剩余秒数

        // 使用 padStart() 保证小时、分钟和秒都是两位数
        const formattedHours = String(hours).padStart(2, '0');
        const formattedMinutes = String(remainingMinutes).padStart(2, '0');
        const formattedSeconds = String(seconds).padStart(2, '0');

        // 返回格式化的时间字符串
        return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    }


    HOME_TITLE_MAX_LENGTH = 40
    HOME_SUMMARY_MAX_LENGTH = 300
    HOME_SEARCH_MAX_LENGTH = 80
    DETAIL_TITLE_MAX_LENGTH = 50


    searchEngineConfig = {
        searchResultMenuOpen: false,
        searchedText: '',
        searchResultList: [],

        isCaseSensitive: false,
        findAllMatches: true,
        minMatchCharLength: 5,
        location: 0,
        threshold: 0.6,
        distance: 100,
        ignoreLocation: false,
    }

    getAbbreviateStr = (str, maxLength = 10) => {
        try {
            if (str.length > maxLength) {
                return {
                    text: str.substring(0, maxLength) + '...',
                    tooltip: str,
                    class: 'tooltip'
                }
            } else {
                return {
                    text: str,
                    tooltip: null,
                    class: null
                }
            }
        } catch (e) {
            return {
                text: null,
                tooltip: null
            }
        }


    }


    patchSearchEngineConfig(value) {
        const temp = this.searchEngineConfig
        if (value.searchResultMenuOpen !== undefined) {
            temp.searchResultMenuOpen = value.searchResultMenuOpen
        }

        if (value.searchedText !== undefined) {
            temp.searchedText = value.searchedText
        }
        if (value.searchResultList !== undefined) {
            temp.searchResultList = value.searchResultList
        }


        if (value.isCaseSensitive !== undefined) {
            temp.isCaseSensitive = value.isCaseSensitive
        }

        if (value.findAllMatches !== undefined) {
            temp.findAllMatches = value.findAllMatches
        }
        if (value.minMatchCharLength !== undefined) {
            temp.minMatchCharLength = value.minMatchCharLength
        }
        if (value.location !== undefined) {
            temp.location = value.location
        }


        if (value.threshold !== undefined) {
            temp.threshold = value.threshold
        }


        if (value.distance !== undefined) {
            temp.distance = value.distance
        }


        if (value.ignoreLocation !== undefined) {
            temp.ignoreLocation = value.ignoreLocation
        }
        this.searchEngineConfig = temp


    }


    VERSION = 'V1.1'


    searchFilter = []

    updateSearchFilter = (value) => {
        this.searchFilter = value
    }


    tagsFilter = {}


    checkTagsChecked() {
        const t = []
        Object.keys(this.tagsFilter).forEach(item => {
            if (this.tagsFilter[item]) {
                t.push(this.tagsFilter[item])
            }
        })

        return t.length !== 0
    }


    getFilterArticles = () => {
        let temp = this.articles?.filter(item => {
            if (this.filterTagsChecked().length === 0) return true
            for (const itemInner of item.tags) {
                if (this.filterTagsChecked().includes(itemInner)) {
                    return true
                }
            }
            return false
        })


        // console.log(_.cloneDeep(this.searchFilter), 'this.searchFilter')


        temp = temp?.filter(item => {
            if (this.searchFilter.length === 0) return true
            if (this.searchFilter.includes(item.id)) return true
            return false
        })

        return temp

    }


    clearTagsFilter = () => {
        this.tagsFilter = {}
    }


    updateTagsFilter = (value) => {
        const temp = this.tagsFilter
        temp[value.key] = value.value
        this.tagsFilter = temp
    }


    filterTagsChecked = () => {
        const temp = []
        Object.keys(this.tagsFilter).forEach(item => {
            if (this.tagsFilter[item]) {
                temp.push(item)
            }
        })

        return temp
    }


    tags = []

    setTags = (value) => {
        this.tags = value
    }


    articleContent = ''
    setArticleContent = (value) => {
        this.articleContent = value
    }


    articleObj = null

    setArticleObj = (value) => {
        this.articleObj = value
    }

    articles = []
    setArticles = (value) => {
        this.articles = value
    }

    viewArticle = false

    setViewArticle = (value) => {
        this.viewArticle = value
    }


    constructor(rootStore) {
        this.rootStore = rootStore
        //成为响应式
        makeAutoObservable(this)
    }
}

export default CommonStore


