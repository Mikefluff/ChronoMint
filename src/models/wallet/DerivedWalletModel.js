/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Immutable from 'immutable'
import BalancesCollection from 'models/tokens/BalancesCollection'
import TransactionsCollection from 'models/wallet/TransactionsCollection'
import { abstractFetchingModel } from '../AbstractFetchingModel'
import OwnerCollection from './OwnerCollection'

export default class DerivedWalletModel extends abstractFetchingModel({
  address: null, //
  balances: new BalancesCollection(),
  tokens: new Immutable.Map(), //
  isMultisig: false, //
  transactions: new TransactionsCollection(),
  owners: new OwnerCollection(),
  customTokens: null,
  deriveNumber: null,
  blockchain: null,
}) {
  id () {
    return this.get('address')
  }

  address () {
    return this.get('address')
  }

  balances (value) {
    return this._getSet('balances', value)
  }

  tokens (value) {
    return this._getSet('tokens', value)
  }

  isMultisig () {
    return this.get('isMultisig')
  }

  transactions (value) {
    return this._getSet('transactions', value)
  }

  owners (value) {
    return this._getSet('owners', value)
  }

  customTokens (value) {
    return this._getSet('customTokens', value)
  }

  deriveNumber () {
    return this.get('deriveNumber')
  }

  isTimeLocked () {
    return false
  }
}
