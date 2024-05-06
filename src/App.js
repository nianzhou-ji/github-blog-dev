import './App.css';
import EffectLImg from './assets/cover/effectL.svg'
import EffectRImg from './assets/cover/effectR.svg'
import LogoImg from './assets/cover/logo.svg'
import AvatarImg from './assets/profile/avatar.svg'
import GithubImg from './assets/profile/github.svg'
import BackImg from './assets/post/back.svg'

import {ImCalendar as CalendarIcon} from "react-icons/im";
import {GiTimeBomb as TimeICon} from "react-icons/gi";
import MDEditor from '@uiw/react-md-editor';

import React, {useEffect, useRef, useState} from "react";
import {observer} from "mobx-react-lite";
import Swal from "sweetalert2";
import {IoSettings as SettingIcon} from "react-icons/io5";
import {useStore} from "./stores";

import {useResizeObserver} from "./hooks/useResizeObserver";
import AbbreviatedComp from "./abbreviatedComp/abbreviatedComp";
import SearchComp from "./components/searchComp/searchComp";
import _ from 'lodash'
import {BiSolidToTop as ToTopIcon} from "react-icons/bi";
import {IoPricetags as TagsIcon} from "react-icons/io5";


function App() {

    const [rootScrollPos, setRootScrollPos] = useState(0)

    const {commonStore} = useStore()
    useEffect(() => {
        fetch('/blogs/config.json')
            .then(response => {
                if (response.ok) {
                    return response.text();
                }
                throw new Error('Network response was not ok.');
            })
            .then(text => {
                const assets = JSON.parse(text).assets
                commonStore.setArticles(assets)
                // console.log(JSON.parse(text))

                const waitedTags = {}
                assets.forEach(item => {
                    item.tags.forEach(innerItem => {
                        waitedTags[innerItem] = ''
                    })
                })

                commonStore.setTags(Object.keys(waitedTags))


            })
            .catch(error => console.error('There was a problem with the fetch operation:', error));
    }, []);


    const [profileContainerRef, profileContainerSize] = useResizeObserver()

    const [headRef, headSize] = useResizeObserver()
    const [searchRef, searchSize] = useResizeObserver()
    const [tagsRef, tagsSize] = useResizeObserver()

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


    return (


        <div id={'JpRoot'} ref={rootRef}
             className='pt-[2px] min-h-screen max-h-screen  w-screen bg-[#071422] relative flex items-center flex-col overflow-auto '>
            <div ref={headRef} className='bg-[#0C1F33]    w-full    flex justify-center
            '>
                <div className='w-full flex justify-between items-center'>
                    <img src={EffectLImg} alt="" className=' w-[25%]'/>
                    <img src={LogoImg} alt="" className='w-[15%]'/>
                    <img src={EffectRImg} alt="" className='w-[20%]'/>
                </div>
            </div>


            <div ref={profileContainerRef}
                 className={`${commonStore.viewArticle ? 'hidden' : null} bg-[#122231]   
                 absolute  flex items-center 
                w-[80%] 
                 p-[16px]
                
                 `} style={{top: headSize.height - 4}}>

                <img src={AvatarImg} alt="" className='w-[15%]'/>
                <div className='ml-[32px] mr-[24px]  h-full  flex-auto '>
                    <div className='flex  justify-between'>
                        <p className='text-white font-bold'>Nianzhou Ji</p>
                        <img src={GithubImg} alt="" className='cursor-pointer hover:border-b hover:border-[#3799F6]'
                             onClick={() => {
                                 window.open('https://github.com/nianzhou-ji', '_blank');
                             }}/>
                    </div>

                    <AbbreviatedComp
                        averageWordSize={10}
                        lineNum={4}
                        className={' text-[#AFC3D3] mt-3  tooltip-bottom'}
                        text={'  I am a versatile software engineer skilled in C++,\n' +
                            '                        Python, HTML, and JavaScript. I have\n' +
                            '                        experience with frameworks such as React, Qt, and Django, enabling me to build robust and\n' +
                            '                        scalable applications. My technical proficiency supports efficient development across\n' +
                            '                        multiple platforms.'}/>

                </div>
            </div>


            <div
                // ref={profileContainerRef}
                className={`${commonStore.viewArticle ? null : 'hidden'} bg-[#122231]   
                 absolute  flex items-start  flex-col
                w-[80%] 
                 p-[16px]
                
                 `} style={{top: headSize.height - 4}}>

                <div className=' cursor-pointer hover:border-b hover:border-[#3799F6]' onClick={() => {
                    commonStore.setViewArticle(false)
                }}>
                    <img src={BackImg} alt=""/>
                </div>

                <div className='mt-[8px]'>

                    <AbbreviatedComp
                        averageWordSize={10}
                        lineNum={3}
                        text={commonStore.articleObj?.name}
                        className={'font-bold text-[#E7EDF4]'}

                    />

                </div>


                <div className={`$${commonStore.viewArticle ? null : 'hidden'} flex  mt-[8px] justify-between`}>
                    <div className='flex items-center '>
                        <CalendarIcon size={20} color={'#AFC3D3'}/>
                        <p data-tip={'document creating time.'}
                           className='tooltip text-[#7C97B1] ml-1 '>{commonStore.articleObj?.date}</p>
                    </div>


                    <div className='flex items-center ml-2'>
                        <TimeICon size={20} color={'#AFC3D3'}/>
                        <p data-tip={'Reading consumes time.'}
                           className='tooltip text-[#7C97B1]  ml-1'>{commonStore.convertMinutesToHMS(commonStore.articleContent.length / commonStore.averageReadVelocity)}</p>
                    </div>


                </div>


            </div>


            <div style={{marginTop: profileContainerSize.height}}
                 className={`${commonStore.viewArticle ? 'hidden' : null}   w-[80%]`}>

                <div className='flex  justify-between'>
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
                                                                              className={'p-[32px] pb-[40px] rounded-[8px] w-full h-[300x] bg-[#122231]  mb-[40px] border border-[#122231] hover:border-[#38BDF8] cursor-pointer relative'}
                                                                              onClick={() => {
                                                                                  commonStore.setViewArticle(true)
                                                                                  commonStore.setArticleObj(item)

                                                                                  fetch(`/blogs/${item.url}`)
                                                                                      .then(response => {
                                                                                          if (response.ok) {

                                                                                              console.log(response, 'response')

                                                                                              return response.text();
                                                                                          }
                                                                                          throw new Error('Network response was not ok.');
                                                                                      })
                                                                                      .then(text => {
                                                                                          commonStore.setArticleContent(text)
                                                                                      })
                                                                                      .catch(error => console.error('There was a problem with the fetch operation:', error));


                                                                              }}

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


            <div className={`${commonStore.viewArticle ? 'hidden' : null} fixed right-1 bottom-3 `}>


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


            <div className={`${commonStore.viewArticle ? null : 'hidden'} mt-[150px] mb-[100px] w-[90vw]`} data-color-mode="dark">
                <MDEditor.Markdown source={commonStore.articleContent} style={{
                    whiteSpace: 'pre-wrap',
                    backgroundColor: '#071522',
                    color: '#AFC3D3'
                }}/>
            </div>


            <div className={`${rootScrollPos > 5 ? null : 'hidden'} fixed left-1 bottom-3`} onClick={() => {
                rootRef.current.scrollTop = 0;
            }}>

                <ToTopIcon size={32} color={'#AAD3F5'}/>

            </div>


            <progress className="fixed top-0 h-[2px] rounded-0 w-screen progress bg-[#0C2036] progress-success" value={rootScrollPos} max="100"></progress>


        </div>
    );
}

export default observer(App);
