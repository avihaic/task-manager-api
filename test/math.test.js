const {calculateTip ,fahreneittocelsius, celsiustofahreneit} = require('../src/math')

test('should calculate total with tip', () => {
const total = calculateTip(10, .3)
    expect(total).toBe(13)
})

test('should calculate total with default tip', () => {
    const total = calculateTip(10)
        expect(total).toBe(12.5)
})

test('should fahreneit 32 F to 0 C', () => {
        const total = fahreneittocelsius(32)
            expect(total).toBe(0)
})

test('should celsius 0 C to 32 F', () => {
    const total = celsiustofahreneit(0)
        expect(total).toBe(32)
})