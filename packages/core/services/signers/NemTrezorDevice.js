/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import TrezorConnect from 'trezor-connect'

export default class NemTrezorDevice {
  constructor ({ seed, network }) {
    this.seed = seed
    this.network = network
    Object.freeze(this)
  }

  async getAddress (path) {
    console.log(this.network)
    const result = await TrezorConnect.nemGetAddress({
      path: "m/44'/43'/0'",//path,
      //network: this.network,
    })
    console.log(result)
    return result.payload.address
  }

  async signTransaction (data) {
    const result = await TrezorConnect.nemSignTransaction({
      path: this.path,
      transaction: data,
    })

    return result.payload.signature
  }
}
