import React from 'react';
import {observer} from "mobx-react-lite";
import {useStore} from "../../stores";
import SearchEngine from "./searchEngine";
import {IoSettings as SettingIcon} from "react-icons/io5";
import Swal from 'sweetalert2'
import ModalContainerComp from "../ModalComp/ModalComp";
import {GrTooltip as TooltipIcon} from "react-icons/gr";

import _ from "lodash";

const SearchComp = () => {
    const {commonStore} = useStore()

    return (


        <div className='mt-[20px] relative'>
            <ModalContainerComp>
                <dialog id="modalSearchConfig" className="modal  ">
                    <div className="modal-box  p-[16px]  w-[95vw] max-w-[95vw] border border-[#38BDF8] bg-[#122231] ">
                        <h3 className="font-bold text-lg text-[#AAD3F5]">Search Config</h3>

                        <div className="form-control mt-2">
                            <div className="flex justify-between">
                                <div className='flex items-center'>
                                    <span className="label-text  text-[#AFC3D3]">Is Case Sensitive</span>
                                    <div className='tooltip tooltip-bottom'
                                         data-tip={'Indicates whether comparisons should be case sensitive.'}>
                                        <TooltipIcon size={16} className='ml-2'/>
                                    </div>
                                </div>


                                <input type="checkbox" className="checkbox "
                                       defaultChecked={commonStore.searchEngineConfig.isCaseSensitive}
                                       value={commonStore.searchEngineConfig.isCaseSensitive}
                                       onChange={e => commonStore.patchSearchEngineConfig({
                                           isCaseSensitive: e.target.checked
                                       })}
                                />
                            </div>
                        </div>


                        <div className="form-control mt-2">
                            <div className="flex justify-between">
                                <div className='flex items-center'>
                                    <span className="label-text  text-[#AFC3D3]">Find All Matches</span>
                                    <div className='tooltip tooltip-bottom'
                                         data-tip={'When true, the matching function will continue to the end of a search pattern even if a perfect match has already been located in the string.'}>
                                        <TooltipIcon size={16} className='ml-2'/>
                                    </div>
                                </div>

                                <input type="checkbox" className="checkbox"
                                       defaultChecked={commonStore.searchEngineConfig.findAllMatches}
                                       value={commonStore.searchEngineConfig.findAllMatches}
                                       onChange={e => commonStore.patchSearchEngineConfig({
                                           findAllMatches: e.target.checked
                                       })}
                                />
                            </div>
                        </div>


                        <div className="form-control mt-2">
                            <div className="flex justify-between">

                                <div className='flex items-center'>
                                    <span className="label-text  text-[#AFC3D3]">Ignore Location</span>
                                    <div className='tooltip tooltip-bottom'
                                         data-tip={'When true, search will ignore location and distance, so it won\'t matter where in the string the pattern appears.'}>
                                        <TooltipIcon size={16} className='ml-2'/>
                                    </div>
                                </div>

                                <input type="checkbox" className="checkbox "

                                       value={commonStore.searchEngineConfig.ignoreLocation}
                                       onChange={e => commonStore.patchSearchEngineConfig({
                                           ignoreLocation: e.target.checked
                                       })}
                                />
                            </div>
                        </div>


                        <div className="form-control mt-2">
                            <div className="flex justify-between">

                                <div className='flex items-center'>
                                    <span className="label-text  text-[#AFC3D3]">Min Match Char Length</span>
                                    <div className='tooltip tooltip-bottom'
                                         data-tip={'Only the matches whose length exceeds this value will be returned. (For instance, if you want to ignore single character matches in the result, set it to 2)'}>
                                        <TooltipIcon size={16} className='ml-2'/>
                                    </div>
                                </div>

                                <input type="number" placeholder="Type here"
                                       className="input input-bordered input-sm w-[70px] "

                                       value={commonStore.searchEngineConfig.minMatchCharLength}
                                       onChange={e => commonStore.patchSearchEngineConfig({
                                           minMatchCharLength: e.target.value
                                       })}

                                />
                            </div>
                        </div>


                        <div className="form-control mt-2">
                            <div className="flex justify-between">


                                <div className='flex items-center'>
                                    <span className="label-text  text-[#AFC3D3]">Location</span>
                                    <div className='tooltip tooltip-bottom'
                                         data-tip={'Determines approximately where in the text is the pattern expected to be found.'}>
                                        <TooltipIcon size={16} className='ml-2'/>
                                    </div>
                                </div>

                                <input type="number" placeholder="Type here"
                                       className="input input-bordered  input-sm w-[70px]"

                                       value={commonStore.searchEngineConfig.location}
                                       onChange={e => commonStore.patchSearchEngineConfig({
                                           location: e.target.value
                                       })}
                                />
                            </div>
                        </div>

                        <div className="form-control mt-2">
                            <div className="flex justify-between">


                                <div className='flex items-center'>
                                    <span className="label-text  text-[#AFC3D3]">Threshold</span>
                                    <div className='tooltip tooltip-bottom'
                                         data-tip={'At what point does the match algorithm give up. A threshold of 0.0 requires a perfect match (of both letters and location), a threshold of 1.0 would match anything.'}>
                                        <TooltipIcon size={16} className='ml-2'/>
                                    </div>
                                </div>

                                <input type="number" placeholder="Type here"
                                       className="input input-bordered  input-sm w-[70px]"

                                       value={commonStore.searchEngineConfig.threshold}
                                       onChange={e => commonStore.patchSearchEngineConfig({
                                           threshold: e.target.value
                                       })}
                                />
                            </div>
                        </div>

                        <div className="form-control mt-2">
                            <div className="flex justify-between">

                                <div className='flex items-center'>
                                    <span className="label-text  text-[#AFC3D3]">Distance</span>
                                    <div className='tooltip tooltip-right'
                                         data-tip={'Determines how close the match must be to the fuzzy location (specified by location). An exact letter match which is distance characters away from the fuzzy location would score as a complete mismatch. A distance of 0 requires the match be at the exact location specified. A distance of 1000 would require a perfect match to be within 800 characters of the location to be found using a threshold of 0.8.'}>
                                        <TooltipIcon size={16} className='ml-2'/>
                                    </div>
                                </div>


                                <input type="number" placeholder="Type here"
                                       className="input input-bordered input-sm w-[70px]"

                                       value={commonStore.searchEngineConfig.distance}
                                       onChange={e => commonStore.patchSearchEngineConfig({
                                           distance: e.target.value
                                       })}
                                />
                            </div>
                        </div>


                        <div className="modal-action">
                            <form method="dialog">
                                {/* if there is a button in form, it will close the modal */}
                                <button className="btn">Close</button>
                            </form>
                        </div>
                    </div>
                </dialog>
            </ModalContainerComp>


            <div className='flex justify-between items-center'>
                <input type="text"
                       className=" pl-4 text-white w-full h-[50px]  bg-[#040F1A]    rounded-[8px] border border-[#1D3041] focus:border-[#38BDF8]   focus:outline-none"
                       placeholder="Search articles, enter key confirm ..."
                       onKeyDown={async e => {
                           if (e.key === 'Enter') {
                               if (commonStore.searchEngineConfig.searchedText.length === 0) return
                               const searchPattern = commonStore.searchEngineConfig.searchedText
                               const searchObj = new SearchEngine(commonStore.articles, {
                                   isCaseSensitive: commonStore.searchEngineConfig.isCaseSensitive,
                                   findAllMatches: commonStore.searchEngineConfig.findAllMatches,
                                   minMatchCharLength: commonStore.searchEngineConfig.minMatchCharLength,
                                   location: commonStore.searchEngineConfig.location,
                                   threshold: commonStore.searchEngineConfig.threshold,
                                   distance: commonStore.searchEngineConfig.distance,
                                   ignoreLocation: commonStore.searchEngineConfig.ignoreLocation,
                                   includeMatches: true,
                                   keys: ['name', 'summary']
                               })


                               searchObj.search(searchPattern)
                               console.log(searchObj.res, 'searchObj.res')
                               const res = searchObj.postSearchResult()
                               // const res = searchObj.res
                               // console.log(_.cloneDeep(res), 'searchObj.res')


                               if (res === null) {
                                   await Swal.fire({
                                       position: "top-end",
                                       icon: "warning",
                                       title: "Not search  result",
                                       showConfirmButton: false,
                                       timer: 1500
                                   });

                                   return

                               }

                               commonStore.patchSearchEngineConfig({
                                   searchResultMenuOpen: true,
                                   searchResultList: res
                               })


                               commonStore.updateSearchFilter(commonStore.searchEngineConfig.searchResultList.map(item => item.id))

                           }
                       }}
                       value={commonStore.searchEngineConfig.searchedText}
                       onChange={e => {
                           commonStore.patchSearchEngineConfig({
                               searchedText: e.target.value
                           })

                           if (commonStore.searchEngineConfig.searchedText.length === 0) {
                               commonStore.patchSearchEngineConfig({
                                   searchResultMenuOpen: false
                               })

                               commonStore.updateSearchFilter([])
                           }


                       }}
                />

                <div className='tooltip' data-tip={'Search config'}>
                    <SettingIcon onClick={() => document.getElementById('modalSearchConfig').showModal()}
                                 size={32}
                                 color='#AAD3F5'
                                 className='ml-2 cursor-pointer scale-100 hover:scale-110 transition-transform duration-300'/>
                </div>
            </div>


            <ul className={`${commonStore.searchEngineConfig.searchResultMenuOpen ? 'menu-dropdown-show' : 'hidden'} menu bg-[#122231]  rounded-[8px]  mt-4 w-[100%] z-20 border border-[#38BDF8]`}>
                {commonStore.searchEngineConfig.searchResultList.map((item, index) => <li
                    key={item.id}
                    onClick={async (e) => {
                        const el = document.getElementById(item.id)
                        if (el) {
                            el.click()

                        }

                        commonStore.patchSearchEngineConfig({
                            searchResultMenuOpen: false
                        })


                    }}><a className='flex justify-between'>

                    <div
                        className={commonStore.getAbbreviateStr(item.name, commonStore.HOME_SEARCH_MAX_LENGTH).class}
                        data-tip={commonStore.getAbbreviateStr(item.name, commonStore.HOME_SEARCH_MAX_LENGTH).tooltip}>{commonStore.getAbbreviateStr(item.name, commonStore.HOME_SEARCH_MAX_LENGTH).text}</div>
                    <div
                        className="badge badge-primary badge-outline ml-2 text-nowrap">{item.match.key === 'name' ? 'match article title' : 'match article abstract'}</div>


                </a></li>)}
            </ul>


        </div>


    );
};

export default observer(SearchComp);
