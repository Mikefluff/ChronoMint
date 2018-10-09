/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import EventEmitter from 'events'
import TransportU2F from '@ledgerhq/hw-transport-u2f'
import AppWaves from './wavesledger'

export default class WavesLedgerDevice extends EventEmitter {
  constructor ({ network }) {
    super()
    this.network = network
  }

  // this method is a part of base interface
  async getAddress (path) {
    console.log('we are here')
    const transport = await TransportU2F.create()
    const app = new AppWaves(transport)
    const result = await app.getWalletPublicKey(path)
    console.log(result)
    return result.bitcoinAddress
  }

}
