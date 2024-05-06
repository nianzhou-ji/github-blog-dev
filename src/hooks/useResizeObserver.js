import {useRef, useLayoutEffect, useState, useEffect} from 'react';
import {useStore} from "../stores";

export function useResizeObserver(mark = '') {
    const ref = useRef(null);
    const [size, setSize] = useState({width: 0, height: 0, top: 0, truncate:false});


    useLayoutEffect(() => {
        const target = ref.current;
        if (!target) return;
        const resizeObserver = new ResizeObserver(entries => {
            const temp = target.getBoundingClientRect()
            setSize({
                width: temp.width,
                height: temp.height,
                top: temp.top,
                truncate: target.scrollHeight > target.clientHeight
            });
        });

        resizeObserver.observe(target);

        return () => {
            resizeObserver.disconnect();
        };
    }, []);

    return [ref, size];
}
