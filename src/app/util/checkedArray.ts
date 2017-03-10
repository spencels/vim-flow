// Defines an array proxy with optional bounds checking.

function isNumeric(n: any): n is number {
	return typeof n !== 'symbol' && !isNaN(parseFloat(n)) && isFinite(n)
}

// If in prodMode, use a regular array instead.
let prodMode = false
export function enableProdMode() {
  prodMode = true
}

let debugging = false
export function enableDebugging() {
  debugging = true
}

// Javascript array with bounds checking. Use `_checkedArray` property to get
// the proxied Array.
export function createCheckedArray(
    target: Array<any> | null = null): Array<any> {
	if (!target) target = []
  if (prodMode) return target

  // Replace child arrays with checked arrays.
  for (let i = 0; i < target.length; i++) {
    if (Array.isArray(target[i]) && !(<any>target[i])._checkedArray) {
      target[i] = createCheckedArray(target[i])
    }
  }
  
  return new Proxy(target, {
    get: function(target: Array<any>, name) {
      if (isNumeric(name)) {
        if (name >= target.length || name < 0) {
          if (debugging) debugger
        	throw new Error('Array out of bounds')
        }
      } else if (name == '_checkedArray') {
        return target
      }

      return target[name]
    },

    set: function(target, name, value) {
      // Convert arrays to checked arrays.
      if (Array.isArray(value) && !(<any>value)._checkedArray) {
        value = createCheckedArray(value)
      }
    	target[name] = value
      return true
    }
  })
}