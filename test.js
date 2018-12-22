import LetItBin from './index'

test( 'test friendpaste', async() => {
    expect.assertions( 2 )
    const letItBin = await new LetItBin( 'friendpaste' )
    const bin = await letItBin.get( 'tPAPw2OTnNvzeIvqebWCi' )
    const change = await letItBin.update( 'tPAPw2OTnNvzeIvqebWCi', 'WIIIIIN' )
    expect( bin.snippet ).toBe( 'WAAAAAT' )
    expect( change.id ).toBe( 'tPAPw2OTnNvzeIvqebWCi' )
})
