import {makeAutoObservable} from "mobx";
import _ from "lodash";


class CommonStore {

    currentHomePageScrollTop = 0

    updateCurrentHomePageScrollTop(value) {
        this.currentHomePageScrollTop = value
    }


    profileSize = {}


    updateProfileSize(value) {
        this.profileSize = value
    }

    profileConfig = {}

    updateProfileConfig(value) {
        this.profileConfig = value

    }


    currentClickedArticleID = null


    updateCurrentClickedArticleID(value) {
        this.currentClickedArticleID = value
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


    isLoaded = false


    setIsLoaded(value) {
        this.isLoaded = value
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


    // 自定义自然排序函数
    naturalSort=(first,second)=> {
        const a = first.name
        const b = second.name


        // 使用正则表达式提取数字和字母部分
        const regex = /(\d+)|(\D+)/g;
        const aParts = a.match(regex);
        const bParts = b.match(regex);

        // 比较每一部分
        for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
            const aPart = aParts[i] || '';
            const bPart = bParts[i] || '';

            // 数字部分按数值比较
            if (/\d/.test(aPart) && /\d/.test(bPart)) {
                const aNum = parseInt(aPart, 10);
                const bNum = parseInt(bPart, 10);
                if (aNum !== bNum) {
                    return aNum - bNum;
                }
            } else {
                // 字母部分按字母顺序比较
                const comparison = aPart.localeCompare(bPart);
                if (comparison !== 0) {
                    return comparison;
                }
            }
        }

        return 0;
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


        // 增加模拟windows下的文件排序桂萼进行排序
         temp = temp.sort(this.naturalSort);

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


    constructor(rootStore) {
        this.rootStore = rootStore
        //成为响应式
        makeAutoObservable(this)
    }
}

export default CommonStore


