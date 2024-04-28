import logo from './logo.svg';
import './App.css';
import EffectLImg from './assets/cover/effectL.svg'
import EffectRImg from './assets/cover/effectR.svg'
import LogoImg from './assets/cover/logo.svg'
import AvatarImg from './assets/profile/avatar.svg'
import GithubImg from './assets/profile/github.svg'
import BackImg from './assets/post/back.svg'
import GithubIcon from './assets/post/github.svg'
import { ImCalendar as CalendarIcon} from "react-icons/im";
import { GiTimeBomb as TimeICon} from "react-icons/gi";
import MDEditor from '@uiw/react-md-editor';

import React, {useEffect, useState} from "react";
import {observer} from "mobx-react-lite";
import {useStore} from "./stores";
import SearchComp from "./components/searchComp/searchComp";





function App() {
    const {commonStore} = useStore()





    useEffect(() => {
        if (!commonStore.searchEngineConfig.searchResultMenuOpen && commonStore.searchEngineConfig.searchedText.length === 0) {
            commonStore.updateSearchFilter([])
        }

    }, [commonStore.searchEngineConfig.searchResultMenuOpen]);


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


    return (
        <div className="max-w-screen min-h-screen  bg-[#071422] relative flex items-center flex-col">
            <div className='w-full h-[296px] bg-[#0C1F33] flex justify-between'>
                <img src={EffectLImg} alt="" className='h-[188px] mt-[70px]'/>
                <img src={LogoImg} alt="" className='h-[148px] w-[98px] mt-[64px]'/>
                <img src={EffectRImg} alt="" className='h-[236px] mt-[60px]'/>
            </div>


            <div
                className='bg-[#0B1B2B] w-[864px] h-[212px] absolute top-[208px] flex flex-col p-[32px] justify-between'>

                <div className='w-[54px] cursor-pointer hover:border-b hover:border-[#3799F6]' onClick={() => {
                    commonStore.setViewArticle(false)
                }}>
                    <img src={BackImg} alt=""/>
                </div>

                <div>
                    <p className={`${commonStore.getAbbreviateStr(commonStore.articleObj?.name, commonStore.DETAIL_TITLE_MAX_LENGTH).class} text-[2rem] text-[#E7EDF4]`}
                       data-tip={commonStore.getAbbreviateStr(commonStore.articleObj?.name, commonStore.DETAIL_TITLE_MAX_LENGTH).tooltip}>{commonStore.getAbbreviateStr(commonStore.articleObj?.name, commonStore.DETAIL_TITLE_MAX_LENGTH).text}</p>
                </div>


                <div className={`$${commonStore.viewArticle ? null : 'hidden'} flex`}>
                    <div className='flex items-center mr-[3rem]'>
                        <CalendarIcon size={32} color={'#AFC3D3'}/>
                        <p data-tip={'document creating time.'} className='tooltip text-[#7C97B1] ml-[10px] text-[1.25rem]'>{commonStore.articleObj?.date}</p>
                    </div>


                    <div className='flex items-center mr-[3rem]'>
                        <TimeICon size={32} color={'#AFC3D3'}/>
                        <p data-tip={'Reading consumes time.'} className='tooltip text-[#7C97B1] ml-[10px] text-[1.25rem]'>{commonStore.convertMinutesToHMS(commonStore.articleContent.length/commonStore.averageReadVelocity)}</p>
                    </div>





                </div>


            </div>


            <div
                className={`${commonStore.viewArticle ? 'hidden' : null} bg-[#0B1B2B] w-[864px] h-[212px] absolute top-[208px] flex items-center p-[32px]`}>
                <div className='min-w-[148px]'>
                    <img src={AvatarImg} alt=""/>
                </div>

                <div className='ml-[32px] mr-[24px]  h-full  flex-auto '>
                    <div className='flex  justify-between'>
                        <p className='text-white font-bold'>Nianzhou Ji</p>
                        <img src={GithubImg} alt="" className='cursor-pointer hover:border-b hover:border-[#3799F6]'
                             onClick={() => {
                                 window.open('https://github.com/nianzhou-ji', '_blank');
                             }}/>
                    </div>

                    <div className='text-wrap text-[#AFC3D3] mt-3'>
                        I am a versatile software engineer skilled in C++, Python, HTML, and JavaScript. I have
                        experience with frameworks such as React, Qt, and Django, enabling me to build robust and
                        scalable applications. My technical proficiency supports efficient development across multiple
                        platforms.


                    </div>
                </div>


            </div>


            <div className={`${commonStore.viewArticle ? 'hidden' : null} mt-[200px] w-[864px]`}>

                <div className='flex  justify-between'>
                    <p className='text-2xl text-[#C4D5E3]'>Articles</p>
                    <p className='text-[#7C97B1]'>{commonStore.getFilterArticles()?.length} articles</p>
                </div>

                <SearchComp/>

            </div>


            <div
                className={`${commonStore.viewArticle ? 'hidden' : null} mt-[50px] w-[864px] flex flex-wrap justify-between`}>
                {
                    commonStore.getFilterArticles().map((item, index) => <div id={item.id}
                                                                              className='p-[32px] rounded-[8px] w-[416px] h-[420px] bg-[#122231] mb-[30px] border border-[#122231] hover:border-[#38BDF8] cursor-pointer relative'
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
                            <p data-tip={commonStore.getAbbreviateStr(item.name, commonStore.HOME_TITLE_MAX_LENGTH).tooltip}
                               className={`${commonStore.getAbbreviateStr(item.name, commonStore.HOME_TITLE_MAX_LENGTH).class} text-[#AAD3F5] text-wrap text-[1.5rem]`}>{commonStore.getAbbreviateStr(item.name, commonStore.HOME_TITLE_MAX_LENGTH).text}</p>
                            <p className='text-[#7C97B1] ml-1'>{item.date}</p>
                        </div>

                        <div
                            className={`${commonStore.getAbbreviateStr(item.summary, commonStore.HOME_SUMMARY_MAX_LENGTH).class} text-wrap  w-full h-[112px]  text-[1.25rem] text-[#AFC3D3] flex justify-start mt-[10px]`}
                            data-tip={commonStore.getAbbreviateStr(item.summary, commonStore.HOME_SUMMARY_MAX_LENGTH).tooltip}>
                            {commonStore.getAbbreviateStr(item.summary, commonStore.HOME_SUMMARY_MAX_LENGTH).text}
                        </div>


                        <div className='absolute right-2 bottom-2 flex'>
                            {item.tags.map((itemInner, index) => <div key={index}
                                                                      className="badge badge-primary badge-outline ml-2">{itemInner}</div>)}


                        </div>


                    </div>)
                }
            </div>


            <div className={`${commonStore.viewArticle ? null : 'hidden'} mt-[200px] w-[864px]`}>
                <MDEditor.Markdown source={commonStore.articleContent} style={{
                    fontSize: '1.5rem',
                    whiteSpace: 'pre-wrap',
                    backgroundColor: '#071522',
                    color: '#AFC3D3'
                }}/>
            </div>

            <div
                className={`${commonStore.viewArticle ? 'hidden' : null} fixed  w-[300px] top-[490px] right-[10px] p-[5px]`}>
                <div className='flex justify-between items-center'>
                    <p className='text-2xl text-[#C4D5E3]'>Tags</p>
                    <p className='text-[#7C97B1] cursor-pointer hover:border-b hover:border-[#7C97B1]' onClick={() => {
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
                <div className='flex flex-wrap'>
                    {
                        commonStore.tags.map((item, index) =>
                            <input key={index} id={`tag-${index}`}
                                   type="checkbox" aria-label={item}
                                   className="btn btn-sm mr-2 mt-2 bg-[#122231] checked:bg-red-600 hover:border-b hover:border-[#38BDF8]"
                                   onChange={(e) => {
                                       commonStore.updateTagsFilter({
                                           key: item,
                                           value: e.target.checked
                                       })


                                   }}/>)
                    }


                </div>

            </div>


        </div>
    );
}

export default observer(App);
