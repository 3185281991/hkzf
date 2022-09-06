import React, { PureComponent } from "react";
import { TabBar } from 'antd-mobile';
import { Outlet } from 'react-router-dom'
import { withRouter } from "../withRouter";

import './index.scss'

class Home extends PureComponent {
  state = {
    tabs: [
      {
        key: '/home/index',
        title: '首页',
        icon: <i className='iconfont icon-ind'></i>,
      },
      {
        key: '/home/citylist',
        title: '找房',
        icon: <i className='iconfont icon-findHouse'></i>,
      },
      {
        key: '/home/news',
        title: '咨询',
        icon: <i className='iconfont icon-infom'></i>,
      },
      {
        key: '/home/profile',
        title: '我的',
        icon: <i className='iconfont icon-my'></i>,
      },
    ],
    activeKey: '/home/index'
  }
  componentDidUpdate(preProps) {
    if (preProps.router.location.pathname !== this.props.router.location.pathname) {
      this.setState({ activeKey: this.props.router.location.pathname })
    }
  }
  click(key) {
    this.props.router.navigate(`${key}`)
    this.setState({ activeKey: key })
  }
  render() {
    const { tabs, activeKey } = this.state
    return (<div className="home" >
      <Outlet />
      <TabBar className="tab" activeKey={activeKey} onChange={(e) => this.click(e)} >
        {
          tabs.map(item => (
            <TabBar.Item
              key={item.key}
              icon={item.icon}
              title={item.title}
            />
          ))
        }
      </TabBar>
    </div >)
  }
}
export default withRouter(Home)