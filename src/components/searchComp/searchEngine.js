import _ from 'lodash'

import Fuse from 'fuse.js'

class SearchEngine {


    static clearStr(str) {
        return str.replace(/<[^>]*>/g, '').replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ').replace(/&nbsp;/g, ' ');
    }


    static  convertSearchDatabase = (value) => {
        return value

    }


    constructor(data, fuseOptions) {
        this.fuse = new Fuse(SearchEngine.convertSearchDatabase(data), fuseOptions);
    }


    search(searchPattern) {
        this.res = this.fuse.search(searchPattern)
        return this.res

    }


    postSearchResult() {
        if (this.res.length === 0) return null
        const res = []
        for (const item1 of this.res) {
            for (const item2 of item1.matches) {
                res.push({
                    id: item1.item.id,
                    match: item2,
                    name: item1.item.name


                })
            }
        }
        return res
    }
}

export default SearchEngine
