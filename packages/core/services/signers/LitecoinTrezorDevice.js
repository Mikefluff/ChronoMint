/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import EventEmitter from 'events'
import bitcoin from 'bitcoinjs-lib'
import TrezorConnect from 'trezor-connect'
import bippath from 'bip32-path'

export default class BitcoinTrezorDevice extends EventEmitter {
  constructor ({ network }) {
    super()
    this.network = network
    Object.freeze(this)
  }

  // this method is a part of base interface
  async getAddress (path) {
    const result = await TrezorConnect.getAddress({
                           path: "m/44'/2'/0'/0/0",
                           coin: "Litecoin"
                         })
    console.log(result)
    return result.payload.address
  }

  async signTransaction (unsignedTxHex) {
    // tx object
    const txb = new bitcoin.TransactionBuilder
      .fromTransaction(bitcoin.Transaction.fromHex(unsignedTxHex), this.network)
    const localAddress = this.getAddress()

    if (!localAddress) {
      return
    }

    const address_n = path.split('/').map((entry) =>
      entry[entry.length - 1] === "'"
        ? parseInt(entry.substring(0, entry.length - 1)) | 0x80000000
        : parseInt(entry)
    )
    const inputs = []

    txb.buildIncomplete().ins.forEach((input) => {
      inputs.push({
        address_n: address_n,
        prev_index: input.index,
        prev_hash: Buffer.from(input.hash)
          .reverse()
          .toString('hex'),
      })
    })

    const outputs = []

    txb.buildIncomplete().outs.forEach((out) => {
      const address = bitcoin.address
        .fromOutputScript(out.script, this.network)
      let output = {
        address: address,
        amount: out.value.toString(),
        script_type: 'PAYTOADDRESS',
      }
      if (address === localAddress) {
        output = { ...output, address_n: address_n }
        delete output['address']
      }
      outputs.push(output)
    })

    const result = await TrezorConnect.signTransaction({
      inputs: inputs,
      outputs: outputs,
      coin: 'Litecoin', // @todo Need to do mainnet support?
    })

    return result

  }
}
