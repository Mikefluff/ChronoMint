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
    const transport = await TransportU2F.create(3000,15000)
    await transport.setExchangeTimeout(60000)
    await transport.setDebugMode(true)
    const app = new AppWaves(transport)
    const result = await app.getWalletPublicKey("44'/5741564'/0'/0'/1'")
    console.log(result)
    return result.bitcoinAddress
  }

}
