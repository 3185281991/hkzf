import React, { Component } from 'react';
import { Swiper } from 'antd-mobile'
import { withRouter } from "../withRouter";
import axios from 'axios';
import './index.scss'
import nav1 from '../../assets/img/nav-1.png';
import nav2 from '../../assets/img/nav-2.png';
import nav3 from '../../assets/img/nav-3.png';
import nav4 from '../../assets/img/nav-4.png';
import { getCurrentCity } from '../../utils';

const nav = [
  { id: 1, name: '整租', path: '/home/citylist', img: nav1 },
  { id: 2, name: '合租', path: '/rent', img: nav2 },
  { id: 3, name: '地图找房', path: '/map', img: nav3 },
  { id: 4, name: '去出租', path: '/hire', img: nav4 }
]

class Index extends Component {
  state = {
    imgs: [],
    group: [],
    infom: [],
    cityName: '上海',
    cid: 'AREA|7C88cff55c-aaa4-e2e0'
  }
  componentDidMount() {
    getCurrentCity().then(res => {
      this.setState({ cityName: res.label, cid: res.value })
    })
    this.getSwiper();
    this.getGroup();
    this.getInfom();
  }
  getSwiper() {
    axios.get('http://localhost:8080/home/swiper').then(res => {
      this.setState({ imgs: res.data.body });
    });
  }
  getGroup() {
    axios.get(`http://localhost:8080/home/groups?area=${this.state.cid}`).then(res => {
      this.setState({ group: res.data.body });
    });
  }
  getInfom() {
    axios.get(`http://localhost:8080/home/news?area=${this.state.cid}`).then(res => {
      this.setState({ infom: res.data.body });
    });
  }
  render() {
    let { imgs, group, cityName, infom } = this.state;
    return (
      <div className='index'>
        {/* 顶部导航 */}
        <div className='nt'>
          <div className='left'>
            <span onClick={() => { this.props.router.navigate('/home/citylist') }}>{cityName}</span>
            <i className='iconfont icon-arrow'></i>
            <span className='input' onClick={() => { this.props.router.navigate('/search') }}>请输入小区或地址</span>
            <i className='iconfont icon-seach'></i>
          </div>
          <i className='iconfont icon-map' onClick={() => { this.props.router.navigate('/map') }}></i>
        </div>
        {/* 轮播图 */}
        <Swiper loop autoplay allowTouchMove autoplayInterval={4000} className='swiper'>

          {
            imgs.map((src) => {
              return <Swiper.Item key={src.id}>
                <div
                  className='content'>
                  <img src={'http://localhost:8080' + src.imgSrc} alt="" />
                </div>
              </Swiper.Item>
            })
          }
        </Swiper>
        {/* 导航菜单 */}
        <div className='nav'>
          {
            nav.map((item) => {
              return <div onClick={() => { this.props.router.navigate(item.path) }} key={item.id}><img src={item.img} alt="" /><span>{item.name}</span></div>
            })
          }

        </div>
        {/* 租房小组 */}
        <div className='rentG'>
          <div className='top'>
            <span>租房小组</span><span>更多</span>
          </div>
          <div className='rcon'>
            {
              group.map((item) => {
                return <div className='item' key={item.id}>
                  <div className='l'>
                    <span>{item.title}</span>
                    <span>{item.desc}</span>
                  </div>
                  <img src={`http://localhost:8080${item.imgSrc}`} alt="" />
                </div>
              })
            }</div>
        </div>
        {/* 咨询 */}
        <div className='infom'>
          <div className='top'>
            <span>最新咨询</span>
          </div>
          {
            infom.map((item) => {
              return <div className='fitem' key={item.id}>
                <div className='left'><img src={`http://localhost:8080${item.imgSrc}`} alt="" /></div>
                <div className='right'>
                  <div className='rt'><span>{item.title}</span> </div>
                  <div className='ru'><span>{item.from}</span><span>{item.date}</span>
                  </div>
                </div>
              </div>
            })
          }
        </div>
      </div >
    )
  }
}
export default withRouter(Index)