# chainState
>npm start

### 配置chain
/chain  
&nbsp;&nbsp;|-core.js  
&nbsp;&nbsp;|-xx.js

### 配置state
/state  
&nbsp;&nbsp;|-core  
&nbsp;&nbsp;&nbsp;&nbsp;|-start.js  
&nbsp;&nbsp;|-xx  
&nbsp;&nbsp;&nbsp;&nbsp;|-doSomething.js

### log变更
从v1.1.0开始将不再使用log4js

换成更通用的[laputa-log](https://github.com/laizhenhai88/laputa-log)

并且也不提供Logger，所以如下代码会得到undefined
```js
require('chain-state').Logger
```
