import { useLocation, useNavigate, useParams } from "react-router-dom";
//   useNavigate  用来跳转用的  函数组件使用  useLocation接收参数用 useParams接收参数
export function withRouter(Component) {
  function ComponentWithRouterProp(props) {
    let location = useLocation();
    let navigate = useNavigate();
    let params = useParams();
    return <Component {...props} router={{ location, navigate, params }} />;
  }

  return ComponentWithRouterProp;
}
