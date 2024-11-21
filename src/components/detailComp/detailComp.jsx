import {ImCalendar as CalendarIcon} from "react-icons/im";
import {GiTimeBomb as TimeICon} from "react-icons/gi";
import MDEditor from '@uiw/react-md-editor';

import React, {useEffect, useRef, useState} from "react";
import {observer} from "mobx-react-lite";
import {useStore} from "../../stores";

import {useResizeObserver} from "../../hooks/useResizeObserver";
import AbbreviatedComp from "../../abbreviatedComp/abbreviatedComp";
import {BiSolidToTop as ToTopIcon} from "react-icons/bi";
import {useNavigate, useParams} from "react-router-dom";
import {useBlogsHooks} from "../../hooks/useBlogsHooks";
import EffectLComp from "../../assetsComp/effectLComp";
import LogoComp from "../../assetsComp/logoComp";
import EffectRComp from "../../assetsComp/effectRComp";
import BackComp from "../../assetsComp/backComp";

import {FaDownload as DownloadIcon} from "react-icons/fa";
import MarkdownViewer from "../MarkdownComp/MarkdownViewer";


function DetailComp() {

    const [rootScrollPos, setRootScrollPos] = useState(0)

    const {fetchBlog, initApp, downloadMarkdownFile} = useBlogsHooks()


    const params = useParams()

    const navigate = useNavigate()

    const {commonStore} = useStore()
    useEffect(() => {
        const callBack = async () => {
            await initApp()
            const item = commonStore.articles.find(item => item.id === params.id)
            if (item) {
                await fetchBlog(item)
            } else {
                alert(`There is no blog with ID ${params.id}.`)
                navigate('/')
            }

        }

        callBack()

    }, []);


    const [headRef, headSize] = useResizeObserver()

    const rootRef = useRef(null);


    return (


        <div ref={rootRef} onScroll={(e) => {

            const scrollElement = e.target

            const totalHeight = scrollElement.scrollHeight - scrollElement.clientHeight;
            const scrollPosition = scrollElement.scrollTop;

            // 计算滚动的百分比
            const scrolledPercentage = (scrollPosition / totalHeight) * 100;

            setRootScrollPos(scrolledPercentage)


            // console.log(e.target.scrollTop,e.target.scrollHeight - e.target.clientHeight, 'detail');
        }}
             className='pt-[2px] min-h-screen max-h-screen  w-screen bg-[#071422] relative flex items-center flex-col overflow-auto '>
            <div ref={headRef} className='bg-[#0C1F33]    w-full    flex justify-center
            '>
                <div className='w-full flex justify-between items-center'>
                    <EffectLComp className=' w-[25%]'/>
                    <LogoComp className=' w-[15%]'/>

                    <EffectRComp className=' w-[20%]'/>

                </div>
            </div>


            <div
                // ref={profileContainerRef}
                className={` bg-[#122231]   
                 absolute  flex items-start  flex-col
                w-[80%] 
                 p-[16px]
                
                 `} style={{top: headSize.height - 60}}>

                <div className=' cursor-pointer hover:border-b hover:border-[#3799F6]' onClick={() => {
                    commonStore.setIsLoaded(true)
                    navigate(`/`)

                }}>
                    <div className=' w-[20%]'>
                        <BackComp/>
                    </div>
                </div>

                <div className='mt-[8px]'>

                    <AbbreviatedComp
                        averageWordSize={10}
                        lineNum={3}
                        text={commonStore.articleObj?.name}
                        className={'font-bold text-[#E7EDF4]'}

                    />

                </div>


                <div className={`flex  mt-[8px] justify-between w-[100%]`}>
                    <div className='flex items-center '>
                        <CalendarIcon size={20} color={'#AFC3D3'}/>
                        <p data-tip={'document creating time.'}
                           className='tooltip text-[#7C97B1] ml-1 '>{commonStore.articleObj?.date}</p>
                    </div>


                    {/*<div className='flex items-center ml-2'>*/}
                    {/*    <TimeICon size={20} color={'#AFC3D3'}/>*/}
                    {/*    <p data-tip={'Reading consumes time.'}*/}
                    {/*       className='tooltip text-[#7C97B1]  ml-1'>{commonStore.convertMinutesToHMS(commonStore.articleContent.length / commonStore.averageReadVelocity)}</p>*/}
                    {/*</div>*/}

                    <div className='flex items-center ml-2 cursor-pointer tooltip-left tooltip'
                         data-tip={'Download Markdown File'}>
                        <DownloadIcon size={20} color={'#AFC3D3'} onClick={async () => {


                            const item = commonStore.articles.find(item => item.id === params.id)
                            const res = await downloadMarkdownFile(`/blogs/${item.url}`)
                            console.log(res)

                        }}/>

                    </div>
                </div>


            </div>


            <div
                className={`${commonStore.isLoaded ? null : 'hidden'} mt-[150px] mb-[100px] w-[80vw]`}
                data-color-mode="dark">
                <MarkdownViewer markdownText={commonStore.articleContent}/>
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
