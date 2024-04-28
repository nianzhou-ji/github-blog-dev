import React from 'react';
import ReactDOM from 'react-dom'
import {observer} from "mobx-react-lite";

const ModalContainerDOM = document.getElementById('ModalContainer');
const ModalContainerComp = ({children}) => {
    return ReactDOM.createPortal(
        children,
        ModalContainerDOM
    );
};

export default observer(ModalContainerComp);