import { merge } from 'lodash'
import dummyjson from 'dummy-json'
import dataTpl from './operations.json'
import helpers from './helpers'

const execTpl = tpl =>
  JSON.parse(
    dummyjson.parse(
      JSON.stringify(tpl),
      merge(helpers, {
        helpers: { reference: x => x }
      })
    )
  )

export default execTpl(dataTpl)
