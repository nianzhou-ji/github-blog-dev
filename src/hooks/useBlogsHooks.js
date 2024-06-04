import {useStore} from "../stores";
import {useNavigate} from "react-router-dom";

export const useBlogsHooks = () => {
    const {commonStore} = useStore()
    const navigate = useNavigate()

    const initApp = async () => {

        try {
            // 获取 blogAssetsConfig.json
            let response = await fetch('/blogs/blogAssetsConfig.json');
            if (!response.ok) {
                console.error('Network response was not ok.');
                return
            }
            let text = await response.text();
            const assets = JSON.parse(text).assets;
            commonStore.setArticles(assets);

            const waitedTags = {};
            assets.forEach(item => {
                item.tags.forEach(innerItem => {
                    waitedTags[innerItem] = '';
                });
            });

            commonStore.setTags(Object.keys(waitedTags));

            // 获取 profileConfig.json
            response = await fetch('/blogs/profileConfig.json');
            if (!response.ok) {
                console.error('Network response was not ok.');
                return
            }
            text = await response.text();
            const profileConfig = JSON.parse(text);

            commonStore.updateProfileConfig(profileConfig);

        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }

    }

    const fetchBlog = async (item) => {
        commonStore.setViewArticle(true)
        commonStore.setArticleObj(item)
        commonStore.setIsLoaded(false)

        try {
            const response = await fetch(`/blogs/${item.url}`);
            if (!response.ok) {
                console.error('Network response was not ok.');
                return
            }

            const text = await response.text();
            commonStore.setArticleContent(text);
            commonStore.setIsLoaded(true);
            navigate(`/blogs/${item.id}`);
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            commonStore.setIsLoaded(true);
        }
    }





    return {fetchBlog,initApp}


}
