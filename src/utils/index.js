import axios from "axios";
export function getCurrentCity() {
  const localCity = JSON.parse(localStorage.getItem("city"));
  if (!localCity) {
    //调用百度地图api，拿到当前城市名称
    return new Promise((resolve, reject) => {
      var myCity = new window.BMapGL.LocalCity();
      myCity.get(async (res) => {
        try {
          const result = await axios.get(
            `http://localhost:8080/area/info?name=${res.name}`
          );
          localStorage.setItem("city", JSON.stringify(result.data.body));
          resolve(result.data.body);
        } catch (e) {
          reject(e);
        }
        //当前后台只支持北上广深四个城市房源信息，默认是上海
      });
    });
  }
  return Promise.resolve(localCity);
}
