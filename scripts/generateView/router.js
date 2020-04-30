/* eslint-disable */
// 引入文件模块
const fs = require('fs')
const path = require('path')
const resolve = (...file) => path.resolve(__dirname, ...file)

const reg = /ROUTER = \[([\s\S]*)]/g
function writeRouter(componentName) {
  const filePath = resolve('../../src/router', 'router.js')
  return new Promise((resolve, reject) => {
    // 读取文件
    fs.readFile(filePath, 'utf8', (err, files) => {
      if (!err) {
        const filesArr = files.match(reg)[0].split(' = ')
        const len = filesArr.length
        const route = filesArr[len - 1]
        const replaceRoute = route.replace(/]$/, '' +
          '  ,{\n' +
          '    path: \'/'+ componentName +'\',\n' +
          '    name: \'home\',\n' +
          '    component: () => import(/* webpackChunkName: "'+componentName+'" */ \'../views/'+ componentName +'/index.vue\')\n' +
          '  }\n' +
          ']')
        const newRouter = files.replace(reg, 'ROUTER = ' + replaceRoute)
        // 写入文件
        fs.writeFile(filePath, newRouter, 'utf8', (err) => {
          if (err){
            console.log(err)
            reject(err)
          } else {
            resolve(true)
          }
        })
      } else {
        reject(err)
        console.log('readFile：' + err)
      }
    })
  })
}

module.exports = writeRouter
