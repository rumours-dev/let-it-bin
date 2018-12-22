import LetItBin from './index'

test( 'test friendpaste', async() => {
    expect.assertions( 1 )
    const letItBin = await new LetItBin( 'friendpaste' )
    const bin = await letItBin.get( 'tPAPw2OTnNvzeIvqebWCi' )
    expect( bin ).toBe( 'sdfdsf' )
})
