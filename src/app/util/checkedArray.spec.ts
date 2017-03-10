import { createCheckedArray } from 'app/util/checkedArray'

describe("checkedArray", function() {
    
  it("equals empty array", () => {
    let a = createCheckedArray([])
    expect(a).toEqual([])
  })
  
  it("equals single array",() => {
    let a = createCheckedArray([1])
    expect(a).toEqual([1])
  })
  
  it("can call push", () => {
    let a = createCheckedArray([])
    a.push(1)
    expect(a).toEqual([1])
  })

	it('throws on out-of-bounds', () => {
  	let a = createCheckedArray([])
    expect(() => a[0]).toThrow()
  })
  
  it('throws on negative index', () => {
  	let a = createCheckedArray([1])
    expect(() => a[-1]).toThrow()
  })
  
  it('child arrays from constructor are also checked', () => {
  	let a = createCheckedArray([[]])
    expect(() => a[0][0]).toThrow()
  })

  it('pushed child arrays are also checked', () => {
    let a = createCheckedArray([])
    a.push([])
    expect(() => a[0][0]).toThrow()
  })

  it('with child arrays should equal source array', () => {
    const source = [[1]]
    const a = createCheckedArray(source)
    expect(a).toEqual(source)
  })

  it('has _checkedArray property', () => {
    const sourceArray = [1,2, 3]
    const a = createCheckedArray(sourceArray)
    expect((a as any)._checkedArray).toEqual(sourceArray)
    expect((a as any)._checkedArray._checkedArray).toBeFalsy()
  })

  it('child array is strictly equal across accesses', () => {
    const a = createCheckedArray([[]])
    expect(a[0]).toBe(a[0])
  })
})