
import HomeComp from "./components/homeComp/homeComp";
import {observer} from "mobx-react-lite";
import { HashRouter as Router, Route, Routes  } from 'react-router-dom';
import DetailComp from "./components/detailComp/detailComp";


function App() {

    return (

        <Router>
            <Routes>
                <Route path="/" element={  <HomeComp/>} />
                <Route path="/blogs/:id" element={<DetailComp />} />
            </Routes>
        </Router>


    );
}

export default observer(App);
