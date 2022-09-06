//导入antd-mobile组件
// import { Button } from "antd-mobile";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.scss";
import "./assets/css/iconfont.css";
import Home from "./pages/Home";
import News from "./pages/News";
import Index from "./pages/Index";
import CityLIst from "./pages/CityList";
import Proifile from "./pages/Profile";
import Map from "./pages/Map";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        {/* 路由部分 */}
        <Routes>
          <Route path="/" element={<Navigate to="/home" />}></Route>
          <Route path="/home" element={<Home />}>
            <Route path="" element={<Navigate to="index" />}></Route>
            <Route path="index" element={<Index />}></Route>
            <Route path="news" element={<News />}></Route>
            <Route path="citylist" element={<CityLIst />}></Route>
            <Route path="profile" element={<Proifile />}></Route>
          </Route>
          <Route path="/map" element={<Map />}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
