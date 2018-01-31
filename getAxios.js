/*
* @Author: bluedoor
* @Date:   2018-01-31 09:43:29
* @Last Modified by:   bluedoor
* @Last Modified time: 2018-01-31 09:43:53
*/
/* 抽象axios开始 */
function getAxios () {
    // 抽象axios   处理多次点击同时请求数据覆盖问题  可以取消相同key值的网络请求
  var CancelToken = axios.CancelToken;
  function _Axios () {}
  _Axios.prototype = {
    // 调试观察请求头函数
    adapter (config) {
      console.log(config);
      return new Promise((resolve,reject) => {
        resolve({data: 'adapter调试'})
      })
    },
    get (key, url, data) {
      if (_Axios.keys.get[key]) {
        _Axios.keys.get[key](key + "-cancel");
      }
      return axios.get(url, {
        params: data,
        cancelToken: new CancelToken(function executor(cancel){
          _Axios.keys.get[key] = cancel;
        })
        // ,adapter : this.adapter
      })
    },
    post (key, url, data) {
      if (_Axios.keys.post[key]) {
        _Axios.keys.post[key](key + "-cancel");
      }
      return axios.post(url, JSON.stringify(data), {
        cancelToken: new CancelToken(function executor(cancel) {
            _Axios.keys.post[key] = cancel;
          })
          // ,adapter: this.adapter
      })
    },
    cancel (key, type) {
      if (key == undefined) {
        // 取消所有的该对象维护的网络请求
        for (var _type in _Axios.keys) {
          for (var _k in _Axios.keys[_type]) {
            _Axios.keys[_type][_k](_Axios.Msg.cancel);
          }
        }
        return
      }
      // 取消指定的网络请求
      type = type ? type : 'get';
      _Axios.keys[type][key] ? _Axios.keys[type][key](key + '-cancel') : null;
      _Axios.keys[type][key] = undefined;
    },
    Msg: {
      cancel: "initiative-cancel-all"
    }
  }
  _Axios.keys = {
    get: {},
    post: {}
  }
  _Axios.Msg = {
    cancel: "initiative-cancel-all"
  }
  return new _Axios();
}
/* 抽象axios end */