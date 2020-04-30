// template.js
module.exports = {
  entryTemplate: compoenntName => {
    return `import ${compoenntName} from './main.vue'
export default [{
  path: '/${compoenntName}',
  name: '${compoenntName}',
  component: ${compoenntName}
}]`
  }
}
