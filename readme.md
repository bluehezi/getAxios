# 介绍
利用axios的cancelToken特性，取消相同key值，相同请求方法的请求，开启新的请求。
避免多次点击同时请求数据覆盖问题

# 说明
```
- get (key, url, data, adapter) :  该方法调用时，会取消相同key值的请求 
      key: 标明相同功能的请求的key值
      url: 请求url地址
      data: 请求参数
      adapter: 空 | 任意值  是否打开调试器。截取请求，查看请求的信息
               空时，不开调试器。
               传入值时，会打开调试器。 并且会把传入的值传到then方法中。可以用来模拟数据

- post (key, url, data, adapter) :  该方法调用时，会取消相同key值的请求
      key: 标明相同功能的请求的key值
      url: 请求url地址
      data: 请求参数
      adapter: 空 | 任意值  是否打开调试器。截取请求，查看请求的信息
               空时，不开调试器。
               传入值时，会打开调试器。 并且会把传入的值传到then方法中。可以用来模拟数据

- cancel (obj) :
      obj {
        key: key | 空, 主动取消值key的请求
        type: 'post' | 'type' | 空   主动取消请求类型为type且key值的请求。为空时，取消所有的key值请求
      }
      obj 为空时，取消所有正在进行的请求
```
# 使用
- 引入外链cdn --- axios
```
  <script src="https://cdn.bootcss.com/axios/0.17.1/axios.js"></script>
```
- 方式
```
  let $axios = getAxios()
  $axios
    .get(key, url, data)
    .then(res => {
      if (res.status === 200) {
        let data = res.data
      } else {
      
      }
    })
    .catch(err => {
      if (err.message === (key + '-cancel') || err.message === $axios.Msg.cancel) {
          return
      }
      console.log(err)
      window.alert("网络错误")
    })
```
- 在vue中的使用
```
  let key = 'fetch'
  methods: {
    fetchData () {
      if (!this.$axios) {
        this.$axios = getAxios();
      }
     
      this.$axios
        .get(key, '/offer/offer-list', data)
        .then(res => {
          if (res.status === 200) {
          } else {
          }
        })
        .catch(err => {
          if (err.message === (key + '-cancel') || err.message === this.$axios.Msg.cancel) {
              return
          }
          console.log(err)
          window.alert("网络错误")
      });
    }
  }
```