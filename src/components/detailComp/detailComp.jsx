import EffectLImg from '../../assets/cover/effectL.svg'
import EffectRImg from '../../assets/cover/effectR.svg'
import LogoImg from '../../assets/cover/logo.svg'
import AvatarImg from '../../assets/profile/avatar.svg'
import GithubImg from '../../assets/profile/github.svg'
import BackImg from '../../assets/post/back.svg'


import {ImCalendar as CalendarIcon} from "react-icons/im";
import {GiTimeBomb as TimeICon} from "react-icons/gi";
import MDEditor from '@uiw/react-md-editor';

import React, {useEffect, useRef, useState} from "react";
import {observer} from "mobx-react-lite";
import Swal from "sweetalert2";
import {IoSettings as SettingIcon} from "react-icons/io5";
import {useStore} from "../../stores";

import {useResizeObserver} from "../../hooks/useResizeObserver";
import AbbreviatedComp from "../../abbreviatedComp/abbreviatedComp";
import SearchComp from "../../components/searchComp/searchComp";
import _ from 'lodash'
import {BiSolidToTop as ToTopIcon} from "react-icons/bi";
import {IoPricetags as TagsIcon} from "react-icons/io5";
import {useNavigate, useParams} from "react-router-dom";
import {useBlogsHooks} from "../../hooks/useBlogsHooks";


function DetailComp() {

    const [rootScrollPos, setRootScrollPos] = useState(0)

    const {fetchBlog, initApp} = useBlogsHooks()


    const params = useParams()







    const {commonStore} = useStore()
    useEffect(() => {
        const callBack = async () => {
            await initApp()
            const item =commonStore.articles.find(item=>item.id===params.id)
            if(item){
                await fetchBlog(item)
            }else {
                alert(`There is no blog with ID ${params.id}.`)
                navigate('/')
            }

        }

        callBack()

    }, []);


    const [headRef, headSize] = useResizeObserver()


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
                    <img src={EffectLImg} alt="" className=' w-[25%]'/>
                    <img src={LogoImg} alt="" className='w-[15%]'/>
                    <img src={EffectRImg} alt="" className='w-[20%]'/>
                </div>
            </div>


            <div
                // ref={profileContainerRef}
                className={` bg-[#122231]   
                 absolute  flex items-start  flex-col
                w-[80%] 
                 p-[16px]
                
                 `} style={{top: headSize.height - 4}}>

                <div className=' cursor-pointer hover:border-b hover:border-[#3799F6]' onClick={() => {
                    commonStore.setViewArticle(false)
                    commonStore.setIsLoaded(true)

                    navigate(`/`)

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


            <div
                className={`${commonStore.viewArticle && commonStore.isLoaded ? null : 'hidden'} mt-[150px] mb-[100px] w-[80vw]`}
                data-color-mode="dark">
                <MDEditor.Markdown source={commonStore.articleContent} style={{
                    whiteSpace: 'pre-wrap',
                    backgroundColor: '#071522',
                    color: '#AFC3D3'
                }}/>
            </div>


            <div className={`${rootScrollPos > 1 ? null : 'hidden'} fixed left-1 bottom-3 p-1  cursor-pointer`}
                 onClick={() => {
                     rootRef.current.scrollTop = 0;
                 }}>

                <ToTopIcon size={32} color={'#AAD3F5'}/>

            </div>


            <progress className="fixed top-0 h-[4px] rounded-0 w-screen progress bg-[#0C2036] progress-success"
                      value={rootScrollPos} max="100"></progress>


            {/*sketch*/}
            <div className={`flex flex-col gap-4 mt-[150px] w-[80vw] ${!commonStore.isLoaded ? null : 'hidden'}`}>
                <div className={`skeleton h-32 w-full bg-[#152231]`}></div>
                <div className={`skeleton h-4 w-28 bg-[#152231]`}></div>
                <div className={`skeleton h-4 w-full bg-[#152231]`}></div>
                <div className={`skeleton h-4 w-full bg-[#152231]`}></div>
            </div>


        </div>
    );
}

export default observer(DetailComp);
