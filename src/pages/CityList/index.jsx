import React, { Component } from 'react'
import { NavBar } from 'antd-mobile'
import axios from 'axios'
import { withRouter } from "../withRouter";
import { List, AutoSizer } from 'react-virtualized'

import { getCurrentCity } from '../../utils';

import './index.scss'



//渲染城市列表格式{a:[{},{}],b:[{},{},{}]}
//渲染有责索引的格式['a','b',...]
const formatCityData = (list) => {
  const cityList = {};
  list.forEach((item) => {
    const first = item.short.slice(0, 1);
    if (cityList[first]) {
      cityList[first].push(item);
    } else {
      cityList[first] = [item];
    }
  })
  const cityIndex = Object.keys(cityList).sort();
  return {
    cityList,
    cityIndex
  }
}
const formatCityIndex = (letter) => {
  switch (letter) {
    case '#':
      return '当前定位';
    case 'hot':
      return '热门城市';
    default:
      return letter.toUpperCase();
  }
}
const _LINE_HEIGHT = 36
const _CITY_HEIGHT = 40
class CityList extends Component {
  constructor(props) {
    super(props);
    this.list = React.createRef()
  }
  state = {
    cityList: null,
    cityIndex: [],
    activeIndex: 0
  }
  async componentDidMount() {
    await this.getCityInfo()
    //防止点击时，列表精度不准确，要确保数据不为空，否则报错
    if (this.state.cityList !== null) {
      this.list.current.measureAllRows();
    }
  }
  async getCityInfo() {
    const data = await axios.get('http://localhost:8080/area/city?level=1');
    const { cityIndex, cityList } = formatCityData(data.data.body);

    const hot = await axios.get('http://localhost:8080/area/hot');
    cityList['hot'] = hot.data.body;
    cityIndex.unshift('hot');

    const curcity = await getCurrentCity()
    cityList['#'] = [curcity];
    cityIndex.unshift('#');
    this.setState({ cityList, cityIndex })

  }
  rowRenderer = ({
    key, // Unique key within array of rows
    index, // 索引号
    isScrolling, // 当前是否滚动
    isVisible, // 当前行是否是可见
    style, // 行样式，指定每一行位置
  }) => {
    const { cityIndex, cityList } = this.state
    return (
      <div key={key} style={style} className='row-city'>
        <div className="title" >{formatCityIndex(cityIndex[index])}</div>
        <div className="name" >{
          cityList[cityIndex[index]].map(item => {
            return <div className="city" key={item.label} onClick={() => { this.changCity(item) }}>{item.label}</div>
          })
        }</div>
      </div >
    );
  }

  onRowsRendered = ({ startIndex }) => {
    //实时拿到起始行的下标,右侧列表高亮改变
    if (this.state.activeIndex !== startIndex) {
      this.setState({ activeIndex: startIndex })
    }
  }
  changeIndex = (index) => {
    this.list.current.scrollToRow(index);
  }
  changCity = (item) => {
    localStorage.setItem('city', JSON.stringify(item))
    this.props.router.navigate('/home/index')
  }
  getRowHeight = ({ index }) => {
    //索引高度+城市数量*高度
    const { cityIndex, cityList } = this.state;
    return _LINE_HEIGHT + cityList[cityIndex[index]].length * _CITY_HEIGHT;
  }
  renderCityIndex = () => {
    const { cityIndex, activeIndex } = this.state;
    return cityIndex.map((item, index) => {
      return <div className='item' key={item} onClick={() => { this.changeIndex(index) }}>
        <span className={activeIndex === index ? 'active' : ''} >{item === 'hot' ? '热' : item.toUpperCase()}</span>
      </div>
    })
  }
  render() {
    return (
      <div className='citylist'>
        <NavBar className='navbar'
          onBack={() => this.props.router.navigate('/home/index')}
        >
          城市选择
        </NavBar>
        {/* 城市列表 */}
        {/* autosizer自适应矿高高调整列表 */}
        <div className='main'>
          <AutoSizer>
            {({ height, width }) => (
              <List
                height={height}
                rowCount={this.state.cityIndex.length}
                rowHeight={this.getRowHeight}
                rowRenderer={this.rowRenderer}
                // 渲染行
                onRowsRendered={this.onRowsRendered}
                width={width}
                // 设置配置项每次变化从头部开始
                scrollToAlignment='start'
                ref={this.list}
              />
            )}
          </AutoSizer>,
          {/* 右侧列表索引 */}
          <div className="rindex">
            {this.renderCityIndex()}
          </div>
        </div>
      </div>
    )
  }
}
export default withRouter(CityList);

