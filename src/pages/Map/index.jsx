import React, { Component } from 'react'
import { NavBar, Toast } from 'antd-mobile'
import { withRouter } from "../withRouter";
import axios from 'axios'
import './index.scss'
class Map extends Component {
  componentDidMount() {
    this.getBaiduMap();
  }
  state = {
    houseList: null,
    isShowList: false
  }
  getBaiduMap() {
    const city = JSON.parse(localStorage.getItem('city'));
    // 在react脚手架中全局对象必须使用window,否则快就会触发eslint

    //引入百度api实例对象
    const map = new window.BMapGL.Map('container')
    this.map = map;
    //拿到当前城市位置名
    var myGeo = new window.BMapGL.Geocoder();
    // 将地址解析结果显示在地图上，并调整地图视野
    let that = this;
    myGeo.getPoint(city.label, function (point) {
      if (point) {
        map.centerAndZoom(point, 11);
        //添加标记物
        // map.addOverlay(new window.BMapGL.Marker(point, { title: city.label }))
        //添加控件
        var scaleCtrl = new window.BMapGL.ScaleControl();  // 添加比例尺控件
        map.addControl(scaleCtrl);
        var zoomCtrl = new window.BMapGL.ZoomControl();  // 添加缩放控件
        map.addControl(zoomCtrl);
        var cityCtrl = new window.BMapGL.CityListControl();  // 添加城市列表控件
        map.addControl(cityCtrl);

        map.enableScrollWheelZoom();//启动鼠标滚轮缩放地图
        map.enableKeyboard();//启动键盘操作地图

        that.renderOverlays(city.value);
        // //添加文本覆盖物
        // data.data.body.forEach(item => {
        //   const { coord: { longitude, latitude }, count, label: areaName } = item;
        //   // 创建文本标注对象
        //   const areaPoint = new window.BMapGL.Point(longitude, latitude)

        // });

      } else {
        alert('您选择的地址没有解析到结果！');
      }
    }, city)

    //设置中心点坐标
    // const point = new window.BMapGL.Point(116.404, 39.915);
    // // 初始化地图，设置中心点坐标和地图级别 
    // map.centerAndZoom(point, 8);
  }
  async renderOverlays(value) {
    Toast.show({
      content: '加载中...',
      icon: 'loading',
      maskClickable: false
    })
    const data = await axios.get(`http://localhost:8080/area/map?id=${value}`)
    Toast.clear();
    const { nextZoom, type } = this.getTypeAndZoom();
    data.data.body.forEach(item => {
      //渲染覆盖物
      this.createOverlays(item, nextZoom, type);
    })
  }
  //根据不同类型渲染地图的缩放大小以及覆盖物类型
  getTypeAndZoom() {
    //拿到地图对象，首次是11
    const zoom = this.map.getZoom();
    let nextZoom, type;
    if (zoom >= 10 && zoom < 12) //小区
    {
      nextZoom = 13;
      //原型覆盖物，（区，镇）
      type = 'circle'
    }
    else if (zoom >= 12 && zoom < 14) {
      nextZoom = 15
      type = 'circle'
    }
    else if (zoom >= 14 && zoom < 16) {
      type = 'rectangle'
    }
    return { nextZoom, type }
  }
  //渲染不同覆盖物
  createOverlays(item, nextZoom, type) {
    const { coord: { longitude, latitude }, count, label: areaName, value } = item;
    const areaPoint = new window.BMapGL.Point(longitude, latitude)
    if (type === 'circle') {
      //城或镇
      this.createCircle(count, areaName, areaPoint, value, nextZoom);
    } else if (type === 'rectangle') {
      //小区
      this.createRect(count, areaName, value, areaPoint)
    }
  }
  //渲染城镇
  createCircle(count, areaName, areaPoint, value, nextZoom) {
    var label = new window.BMapGL.Label('', {
      position: areaPoint, // 指定文本标注所在的地理位置
      offset: new window.BMapGL.Size(-35, -35) // 设置文本偏移量
    });
    //调用label.setContent()方法在label内部传入html结构修改文本,这里可以将文本内容设为空
    label.setContent(
      `<div class="bdlabel">
      <p class="bdname">${areaName}</p>
      <p>${count}</p>
     </div>`
    )
    // 自定义文本标注样式
    label.setStyle({
      backgroundColor: 'none',
      border: '0px solid white'
    });
    //添加单击事件,点击后进入下一级地图，重新获取该id下的房源信息，改变图层大小
    label.addEventListener('click', () => {
      this.renderOverlays(value);
      //根据房屋标识为中心放大地图
      this.map.centerAndZoom(areaPoint, nextZoom);
      //清楚当前覆盖物信息,
      setTimeout(() => {
        this.map.clearOverlays();
      }, 0)
    })
    this.map.addOverlay(label);
  }
  //渲染小区
  createRect(count, areaName, value, areaPoint) {
    var label = new window.BMapGL.Label('', {
      position: areaPoint, // 指定文本标注所在的地理位置
      offset: new window.BMapGL.Size(-50, -28) // 设置文本偏移量
    });
    //调用label.setContent()方法在label内部传入html结构修改文本,这里可以将文本内容设为空
    label.setContent(
      `<div class="bdRec">
      <p class="bdname">${areaName}</p>
      <p>${count}</p>
     </div>`
    )
    // 自定义文本标注样式
    label.setStyle({
      backgroundColor: 'none',
      border: '0px solid white'
    });
    const that = this;
    //添加单击事件,小区后不需要从新渲染了，此时还需要将这个房源居中位置
    label.addEventListener('click', (e) => {
      that.getStreeInfoList(value);
      const target = e.srcElement.domElement;
      this.map.panBy(window.innerWidth / 2 - target.offsetLeft, (window.innerHeight - 330) / 2 - target.offsetTop)
    })
    this.map.addOverlay(label);
    //移动地图后不显示房源信息
    this.map.addEventListener('movestart', () => {
      this.setState({ isShowList: false })
    })
  }
  //获取小区房源数据
  async getStreeInfoList(id) {
    const data = await axios.get(`http://localhost:8080/houses?cityId?=${id}`);
    this.setState({ houseList: data.data.body.list, isShowList: true })
  }
  render() {
    let { houseList } = this.state;
    return <div className='map'>
      <NavBar className='navbar'
        onBack={() => this.props.router.navigate('/home/index')}
      >
        地图看房
      </NavBar>
      <div id="container">
      </div>
      <div className={['show', this.state.isShowList ? 'appre' : ''].join(' ')}>
        <div className='top'>
          <span>房屋信息</span><span>查看更多</span>
        </div>
        <div className='con'>
          {
            // 小区列表数据
            houseList !== null ? houseList.map(item => {
              return <div className='item' key={item.houseCode}>
                <div className='left'><img src={`http://localhost:8080${item.houseImg}`} alt="" /></div>
                <div className='right'>
                  <p>{item.title}</p>
                  <p>{item.desc}</p>
                  <p>{item.tags.join(',')}</p>
                  <p>{item.price}元/月</p>
                </div>
              </div>
            }) : ''
          }</div>
      </div>

    </div >
  }
}
export default withRouter(Map)
