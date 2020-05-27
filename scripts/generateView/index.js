const chalk = require('chalk')
const path = require('path')
const fs = require('fs')
const resolve = (...file) => path.resolve(__dirname, ...file)
const log = message => console.log(chalk.green(`${message}`))
const successLog = message => console.log(chalk.blue(`${message}`))
const errorLog = error => console.log(chalk.red(`${error}`))
// TODO 1、可以根据配置指定模板组件、 2、可以根据配置文件更改 table 表头字段

// 导入模板
const listTemplate = require('./listTemplate')
const comTemplate = require('./comTemplate')
const writeRouter = require('./router')

// 生成文件
const generateFile = (path, data) => {
  if (fs.existsSync(path)) {
    errorLog(`${path}文件已存在`)
    return
  }
  return new Promise((resolve, reject) => {
    fs.writeFile(path, data, 'utf8', err => {
      if (err) {
        errorLog(err.message)
        reject(err)
      } else {
        resolve(true)
      }
    })
  })
}
log('请输入要生成的页面组件名称、会生成在 views/目录下')
let folderComName = ''
process.stdin.on('data', async chunk => {
  // 组件名称
  const enterName = String(chunk).trim().toString()
  // Vue页面组件路径
  const folderName = resolve('../../src/views', enterName)
  // 设置弹窗组件
  const componentPath = resolve(folderName, 'component')
  // 组件 index 文件
  const vueFile = resolve(folderName, 'index.vue')
  // 组件弹窗文件
  const formPopFile = resolve(componentPath, 'formPop.vue')
  // 入口文件
  // const entryFile = resolve(componentPath, 'entry.js')
  // 判断组件文件夹是否存在
  const hasComponentExists = fs.existsSync(folderName)
  if (hasComponentExists) {
    errorLog(`${enterName}页面组件已存在，请重新输入`)
    return
  } else {
    log(`正在生成 ${enterName} 目录 ${folderName}`)
    await dotExistDirectoryCreate(folderName)
    log(`正在生成 component 目录 ${componentPath}`)
    await dotExistDirectoryCreate(componentPath)
  }
  try {
    // 获取组件名
    if (enterName.includes('/')) {
      const folderArr = folderName.split('/')
      folderComName = folderArr[folderArr.length - 1]
    } else {
      folderComName = enterName
    }
    log(`正在生成 ${enterName} 目录 vue 文件 ${vueFile}`)
    await generateFile(vueFile, listTemplate(folderComName))
    log(`正在生成 ${enterName}/component 目录 vue 文件 ${formPopFile}`)
    await generateFile(formPopFile, comTemplate('formPop'))
    log(`正在生成 router 目录最新 js 文件`)
    // TODO 生成 router.js 参考一下 webpack 如何修改 html
    await writeRouter(enterName)
    // log(`正在生成 entry 文件 ${entryFile}`)
    // await generateFile(entryFile, entryTemplate(componentName))
    successLog('生成成功')
  } catch (e) {
    errorLog(e.message)
  }
  process.stdin.emit('end')
})

process.stdin.on('end', () => {
  log('exit')
  process.exit()
})

function dotExistDirectoryCreate (directory) {
  return new Promise((resolve) => {
    mkdirs(directory, function () {
      resolve(true)
    })
  })
}
// 递归创建目录
function mkdirs (directory, callback) {
  var exists = fs.existsSync(directory)
  if (exists) {
    callback()
  } else {
    mkdirs(path.dirname(directory), function () {
      fs.mkdirSync(directory)
      callback()
    })
  }
}
