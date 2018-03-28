# chainState
>npm start...

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

### 配置log4js
/log4js.json
```json
{
  "appenders": {
    "out": {
      "type": "console"
    },
    "daily": {
      "type": "dateFile",
      "filename": "../logs/",
      "pattern": "yyyy-MM-dd.log",
      "alwaysIncludePattern": true
    }
  },
  "categories": {
    "default": {
      "appenders": ["daily", "out"],
      "level": "debug"
    }
  }
}
```
