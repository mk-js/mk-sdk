import React from 'react'
import { render } from 'react-dom'
import * as appLoader from 'mk-app-loader'
import utils from 'mk-utils'
import * as component from 'mk-component'
import metaEngine from 'mk-meta-engine'
import { Provider } from 'react-redux'
import 'mk-component/dist/assets/style/index.less'

//注册组件
Object.keys(component).forEach(key=>{
    metaEngine.componentFactory.registerComponent(key, component[key])
})

const defaultConfigOption = {
    toast : component.Toast, //轻提示使用组件，mk-meta-engine使用
    notification : component.Notification, //通知组件
    modal: component.Modal 
}

//默认配置fetch
utils.fetch.config({
    mock: true,
    after: (response, url) => {
        if (response.result) {
            if (response.token) {
                utils.fetch.config({ token: response.token })
            }
            return response.value
        }
        else {
            component.Toast.error(response.error.message)
            throw { url, response }
        }
    }
})

appLoader.init()

metaEngine.config({...defaultConfigOption})


export default {
    appLoader,
    utils,
    component,
    metaEngine,
    //初始化MK环境
    init: (option) => {
        appLoader.init(option)
    },
    //配置元数据引擎
    config: (option)=>{
        metaEngine.config(option)
    },
    //注册App
    registerApp: (app) => {
        appLoader.registerApp(app.name, app)
    },
    //render
    render: (appName, targetDomId) => {
        render(
            <Provider store={window.__mk_store__}>
                <appLoader.AppLoader name={appName} />
            </Provider>,
            document.getElementById(targetDomId)
        )
    } 
}

/*
app.config()

mk.init()

mk.registerApp(app)

mk.render()
*/