var vm = Lightue({
  inputs: {
    width: {
      $tag: 'input',
      _type: 'number',
      oninput: showRatio,
    },
    $$: ':',
    height: {
      $tag: 'input',
      _type: 'number',
      oninput: showRatio,
    },
  },
  result: {
    label: '简化后比值为',
    content: '',
  }
})

function getGCD(a, b) { // greatest common divider
  if (a == '' || b == '') return null
  if (a == b) return a
  if (a < b) {
    var c = a
    a = b
    b = c
  }
  var r = a % b
  if (r == 0) return b
  else if (r == 1) return 1
  else return getGCD(b, r)
}

function calcRatio(a, b) {
  var gcd = getGCD(a, b)
  if (gcd) return a/gcd + ':' + b/gcd
  else return ''
}

function showRatio() {
  vm.result.content = calcRatio(vm.inputs.width.$value, vm.inputs.height.$value)
}