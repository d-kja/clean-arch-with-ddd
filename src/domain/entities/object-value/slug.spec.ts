import { describe, expect, it } from 'vitest'
import { Slug } from './slug'

describe('@value-object/slug', () => {
  it('Should normalize the text', async () => {
    const slug = Slug.fromText('An--WeíRd ËxamPle!')

    expect(slug.value).toEqual('an-weird-example')
  })
})
