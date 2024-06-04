import React, {useEffect, useRef, useState} from "react";
import {observer} from "mobx-react-lite";

import {useStore} from "../../stores";

import {useResizeObserver} from "../../hooks/useResizeObserver";
import AbbreviatedComp from "../../abbreviatedComp/abbreviatedComp";
import SearchComp from "../../components/searchComp/searchComp";
import _ from 'lodash'
import {BiSolidToTop as ToTopIcon} from "react-icons/bi";
import {IoPricetags as TagsIcon} from "react-icons/io5";

import {useBlogsHooks} from "../../hooks/useBlogsHooks";
import {useNavigate} from "react-router-dom";
import GithubComp from "../../assetsComp/githubComp";
import LogoComp from "../../assetsComp/logoComp";
import AvatarComp from "../../assetsComp/avatarComp";
import EffectLComp from "../../assetsComp/effectLComp";
import EffectRComp from "../../assetsComp/effectRComp";
import ProfileLinkComp from "../../assetsComp/profileLinkComp";


function HomeComp() {
    const BorderClass = ' cursor-pointer  hover:border-[2px] border-[#071422] hover:rounded-[6px] hover:border-[#38BDF8]'

    const [rootScrollPos, setRootScrollPos] = useState(0)
    const {fetchBlog, initApp} = useBlogsHooks()

    const {commonStore} = useStore()
    useEffect(() => {

        const callBack = async () => {
            await initApp()
        }

        callBack()

    }, []);


    const [profileContainerRef, profileContainerSize] = useResizeObserver()

    const [headRef, headSize] = useResizeObserver()
    const [searchRef, searchSize] = useResizeObserver()


    const rootRef = useRef(null)


    useEffect(() => {
        const scrollElement = rootRef.current;
        // 当组件加载后，添加滚动事件监听器
        const handleScroll = () => {
            if (scrollElement) {
                // console.log('Scroll position:', rootRef.current.scrollTop);

                const totalHeight = scrollElement.scrollHeight - scrollElement.clientHeight;
                const scrollPosition = scrollElement.scrollTop;

                // 计算滚动的百分比
                const scrolledPercentage = (scrollPosition / totalHeight) * 100;

                setRootScrollPos(scrolledPercentage)
            }
        };


        if (scrollElement) {
            scrollElement.addEventListener('scroll', handleScroll);
        }

        // 清理函数：组件卸载前，移除滚动事件监听器
        return () => {
            if (scrollElement) {
                scrollElement.removeEventListener('scroll', handleScroll);
            }
        };
    }, []); // 空依赖数组确保事件监听只被添加和移除一次


    const navigate = useNavigate()


    return (


        <div id={'JpRoot'} ref={rootRef}
             className='pt-[2px] min-h-screen max-h-screen  w-screen bg-[#071422] relative flex items-center flex-col overflow-auto '>
            <div ref={headRef} className='bg-[#0C1F33]    w-full    flex justify-center
            '>
                <div className='w-full flex justify-between items-center'>
                    <EffectLComp className=' w-[25%]'/>
                    <LogoComp className=' w-[15%]'/>
                    <EffectRComp className=' w-[20%]'/>
                </div>
            </div>


            <div ref={profileContainerRef}
                 className={`${commonStore.viewArticle ? 'hidden' : null} bg-[#122231]   
                 absolute  flex items-center 
                w-[80%] 
                 p-[16px]
                
                 `} style={{top: headSize.height - 60}}>


                <AvatarComp className='w-[45%]'/>


                <div className='ml-[32px] mr-[24px]  h-full  flex-auto '>
                    <div className='flex  justify-between'>
                        <p className='text-white font-bold'>{commonStore.profileConfig.name}</p>
                        {/*<img src={GithubImg} alt="" className='cursor-pointer hover:border-b hover:border-[#3799F6]'*/}
                        {/*     onClick={() => {*/}
                        {/*         window.open(commonStore.profileConfig.GitHubUrl, '_blank');*/}
                        {/*     }}/>*/}

                        <ProfileLinkComp className='cursor-pointer hover:border-b hover:border-[#3799F6]'  onClick={() => {
                            window.open(commonStore.profileConfig.GitHubUrl, '_blank');
                        }}/>
                    </div>

                    <AbbreviatedComp
                        averageWordSize={10}
                        lineNum={4}
                        className={' text-[#AFC3D3] mt-3  tooltip-bottom'}
                        text={commonStore.profileConfig.description}/>

                </div>
            </div>


            <div style={{marginTop: profileContainerSize.height + 20}}
                 className={`${commonStore.viewArticle ? 'hidden' : null}   w-[80%]  `}>

                <div className='flex  justify-between items-center'>
                    <p className='text-2xl text-[#C4D5E3]'>Articles</p>
                    <p className='text-[#7C97B1]'>{commonStore.getFilterArticles()?.length} articles</p>
                </div>

                <div ref={searchRef}>
                    <SearchComp/>
                </div>


            </div>

            <div style={{marginTop: 30}}
                 className={`${commonStore.viewArticle ? 'hidden' : null}  w-[80%] flex flex-wrap justify-between`}>
                {
                    commonStore.getFilterArticles().map((item, index) => <div id={item.id}
                                                                              className={BorderClass + ' p-[32px] pb-[40px] rounded-[8px] w-full h-[300x] bg-[#122231]  mb-[40px] relative '}
                                                                              onClick={() => navigate(`/blogs/${item.id}`)}
                                                                              key={index}
                    >
                        <div className='flex justify-between '>
                            <AbbreviatedComp
                                averageWordSize={10}
                                lineNum={3}
                                className={'break-words text-left  text-[#AFC3D3]  font-bold'}
                                text={item.name}/>
                            <p className='text-[#7C97B1] ml-1'>{item.date}</p>

                        </div>


                        <div className="divider"></div>


                        <AbbreviatedComp
                            averageWordSize={10}
                            lineNum={10}
                            className={'break-words text-left  text-[#AFC3D3]  '}
                            text={item.summary}/>


                        <div className='absolute right-2 bottom-2 flex'>
                            {item.tags.map((itemInner, index) => <div key={index}
                                                                      className="badge badge-primary badge-outline ml-2">{itemInner}</div>)}


                        </div>


                    </div>)
                }
            </div>


            <div className={`${commonStore.viewArticle ? 'hidden' : null} fixed right-1 bottom-3 p-1 cursor-pointer`}>
                <TagsIcon size={32} color={commonStore.checkTagsChecked() ? '#38BDF8' : '#AAD3F5'} onClick={() => {
                    document.getElementById('tagsEl').click()
                }}/>

                <div className="drawer  ">
                    <input id="my-drawer-4" type="checkbox" className="drawer-toggle"/>
                    <div className="drawer-content">
                        {/* Page content here */}
                        <label htmlFor="my-drawer-4" className="drawer-button btn btn-primary hidden" id={'tagsEl'}>Open
                            drawer</label>
                    </div>
                    <div className="drawer-side ">
                        <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
                        <ul className="menu p-4 w-[50vw] max-w-[200px] min-h-full bg-base-200 text-base-content">
                            {/* Sidebar content here */}


                            <li>
                                <div className='flex justify-between items-center'>
                                    <p className='text-2xl text-[#C4D5E3]'>Tags</p>
                                    <p className='text-[#7C97B1] cursor-pointer hover:border-b hover:border-[#7C97B1]'
                                       onClick={() => {
                                           commonStore.tags.forEach((item, index) => {
                                                   const obj = document.getElementById(`tag-${index}`)
                                                   if (obj) {
                                                       document.getElementById(`tag-${index}`).checked = false
                                                   }
                                               }
                                           )


                                           commonStore.clearTagsFilter()
                                       }}>Clear</p>
                                </div>
                            </li>

                            {
                                commonStore.tags.map((item, index) =>
                                    <li key={index}>
                                        <input id={`tag-${index}`}
                                               type="checkbox" aria-label={item}
                                               className="btn btn-sm mr-2 mt-2 bg-[#122231] checked:bg-red-600 hover:border-b hover:border-[#38BDF8]"
                                               onChange={(e) => {
                                                   commonStore.updateTagsFilter({
                                                       key: item,
                                                       value: e.target.checked
                                                   })


                                               }}/>
                                    </li>
                                )
                            }

                        </ul>

                    </div>
                </div>
            </div>


            <div className={`${rootScrollPos > 1 ? null : 'hidden'} fixed left-1 bottom-3 p-1  cursor-pointer`}
                 onClick={() => {
                     rootRef.current.scrollTop = 0;
                 }}>

                <ToTopIcon size={32} color={'#AAD3F5'}/>

            </div>


            <progress className="fixed top-0 h-[4px] rounded-0 w-screen progress bg-[#0C2036] progress-success"
                      value={rootScrollPos} max="100"></progress>


        </div>
    );
}

export default observer(HomeComp);
