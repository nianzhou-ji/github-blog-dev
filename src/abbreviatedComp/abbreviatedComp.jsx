import React from 'react';
import {observer} from "mobx-react-lite";
import {useResizeObserver} from "../hooks/useResizeObserver";
import {useStore} from "../stores";

const AbbreviatedComp = ({text, className, lineNum, averageWordSize}) => {
    const {commonStore} = useStore()
    const [elRef, elSize] = useResizeObserver()
    return     (
        <div ref={elRef}
             data-tip={commonStore.getAbbreviateStr(text, elSize?.width / averageWordSize * lineNum).tooltip}
             className={`break-words text-left ${commonStore.getAbbreviateStr(text, elSize?.width / averageWordSize * lineNum).class} ` + className}>
            {commonStore.getAbbreviateStr(text, elSize?.width / averageWordSize * lineNum).text}
        </div>
    );
};

export default observer(AbbreviatedComp);