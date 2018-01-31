# 介绍
利用axios的cancelToken特性，取消相同key值，相同请求方法的请求，开启新的请求。
避免多次点击同时请求数据覆盖问题
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