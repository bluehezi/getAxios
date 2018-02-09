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
    /** 闭包调试   
      1、调试观察请求头函数
      2、调试，自定义返回数据，到 then 或 catch 函数中，可以用来模拟数据
    */
    _closuresAdapter: function (data) {
      return function (config) {
        let _data
        config._Axios_tip = '调试信息'
        console.log(config)
        
        _data = JSON.parse(JSON.stringify(data))
        return new Promise((resolve, reject) => {
          resolve({
            data: _data,
            tip: 'adapter调试'
          })
        })
      }
    },
    get: function (key, url, data, adapter) {
      if (!key) {
        console.log('key值不能为空')
        return
      }
      this.cancel({
        key,
        type: 'get'
      })
      return new Promise((resolve, reject) => {
        axios.get(url, {
          params: data,
          cancelToken: new CancelToken(function executor(cancel){
            _Axios.keys.get[key] = cancel;
          })
          ,adapter: adapter ? this._closuresAdapter(adapter) : null
        }).then(res => {
          resolve(res)
        }).catch(err => {
          // 拦截 如果是请求被取消而报出的错误
          if (err.message == key + '-cancel' || err.message == _Axios.Msg.cancel ) {
            return
          }
          reject(err)
        })
      }) 
    },
    post: function (key, url, data, adapter) {
      if (!key) {
        console.log('key值不能为空')
        return
      }
      this.cancel({
        key,
        type: 'post'
      })

      return new Promise((resolve, reject) => {
        axios.post(url, JSON.stringify(data), {
          cancelToken: new CancelToken(function executor(cancel) {
              _Axios.keys.post[key] = cancel;
            })
          ,adapter: adapter ? this._closuresAdapter(adapter) : null
        }).then(res => {
          resolve(res)
        }).catch(err => {
          // 拦截 如果是请求被取消而报出的错误
          if (err.message == key + '-cancel' || err.message == _Axios.Msg.cancel ) {
            return
          }
          reject(err)
        })
      })
    },
    Msg: {
      cancel: "initiative-cancel-all"  // 取消所有的请求，用到的消息提示
    },
    cancel: function (obj) {
      if (!obj) {
        this.cancelAll();
        return
      }
      let key = obj.key,
          type = obj.type;
      if (!key && type) {  // 只传 type 值 时
        for (let _k in _Axios.keys[type]) {
          _Axios.keys[type][_k](_k + '-cancel');
          _Axios.keys[type][_k] = undefined;
        }
      } else if (key && !type) {  // 只传 key 值时
        for (let _type in _Axios.keys) {
          _Axios.keys[_type][key] ? _Axios.keys[_type][key](key + '-cancel') : null;
          _Axios.keys[_type][key] = undefined;
        }
      } else if (key && type) { // 同时传 key 和  type 时
        _Axios.keys[type][key] ? _Axios.keys[type][key](key + '-cancel') : null;
        _Axios.keys[type][key] = undefined;
      } else {
        this.cancelAll();
      }
    },
    cancelAll: function () {
      // 取消所有的该对象维护的网络请求        
      for (let _type in _Axios.keys) {
        for (let _k in _Axios.keys[_type]) {
          _Axios.keys[_type][_k](_Axios.Msg.cancel);
          _Axios.keys[_type][_k] = undefined;
        }
      }
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