import LetItBin from './index'

test( 'test friendpaste', async() => {
    expect.assertions( 3 )
    const letItBin = await new LetItBin( 'friendpaste' )
    const bin = await letItBin.get( 'tPAPw2OTnNvzeIvqebWCi' )
    const change = await letItBin.update( 'tPAPw2OTnNvzeIvqebWCi', 'GG' )
    const create = await letItBin.create( 'blabla' )
    expect( bin.snippet ).toBe( 'gg' )
    expect( change.id ).toBe( 'tPAPw2OTnNvzeIvqebWCi' )
    expect( create.ok ).toBe( true )
})
