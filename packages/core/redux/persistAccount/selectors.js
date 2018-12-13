/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'
import { DUCK_NETWORK } from '@chronobank/login/redux/network/constants'
import {
  WALLET_TYPE_MEMORY,
  WALLET_TYPE_TREZOR,
  WALLET_TYPE_TREZOR_MOCK,
  WALLET_TYPE_LEDGER,
  WALLET_TYPE_LEDGER_MOCK,
} from '../../models/constants/AccountEntryModel'
import EthereumTrezorDeviceMock from '../../services/signers/EthereumTrezorDeviceMock'
import EthereumLedgerDeviceMock from '../../services/signers/EthereumLedgerDeviceMock'
import EthereumTrezorDevice from '../../services/signers/EthereumTrezorDevice'
import EthereumLedgerDevice from '../../services/signers/EthereumLedgerDevice'
import EthereumMemoryDevice from '../../services/signers/EthereumMemoryDevice'
  DEFAULT_ACTIVE_BLOCKCHAINS,
  DUCK_PERSIST_ACCOUNT, TREZOR_ACTIVE_BLOCKCHAINS,
} from './constants'
import {
  WALLET_TYPE_TREZOR,
  WALLET_TYPE_TREZOR_MOCK,
} from '../../models/constants/AccountEntryModel'

export const getPersistAccount = (state) => {
  return state.get(DUCK_PERSIST_ACCOUNT)
}

export const getBlockchainList = (state) => {
  const account = getPersistAccount(state)
<<<<<<< HEAD
  console.log(account)
  switch (account.selectedWallet.type) {
    case WALLET_TYPE_TREZOR_MOCK: {
      return new EthereumTrezorDeviceMock()
    }
    case WALLET_TYPE_TREZOR: {
      return new EthereumTrezorDevice({xpubkey: account.selectedWallet.encrypted[0].xpubkey})
    }
    case WALLET_TYPE_LEDGER_MOCK: {
      return new EthereumLedgerDeviceMock()
    }
    case WALLET_TYPE_LEDGER: {
      return new EthereumLedgerDevice()
    }
    case WALLET_TYPE_MEMORY: {
      return new EthereumMemoryDevice(account.decryptedWallet.privateKey)
    }
  }
=======
  return account.selectedWallet.blockchainList || DEFAULT_ACTIVE_BLOCKCHAINS
>>>>>>> 9c669ec958f53fd239b4d8d22d0b4d4015fdeb0a
}

export const getSelectedWallet = (state) => {
  const account = getPersistAccount(state)
  return account.selectedWallet
}

export const getNetwork = (state) => {
  return state.get(DUCK_NETWORK)
}

export const getSelectedNetworkId = (state) => {
  const { selectedNetworkId } = getNetwork(state)
  return selectedNetworkId
}

export const getSelectedNetwork = (blockchain) => createSelector(
  getNetwork,
  (network) => {
    if (!network || !network.selectedNetworkId || !network.networks) {
      return null
    }

    if (blockchain) {
      const networks = network.networks.find(
        (item) => item.id === network.selectedNetworkId,
      )

      return networks[blockchain]
    } else {
      return network.networks.find(
        (item) => item.id === network.selectedNetworkId,
      )
    }
  },
)

export const getCustomNetworksList = createSelector(
  (state) => state.get(DUCK_PERSIST_ACCOUNT),
  (persistAccount) => persistAccount.customNetworksList,
)

export const getSelectedWalletKey = createSelector(
  getPersistAccount,
  (account) => {
    return account.selectedWallet.key
  }
)

export const getAddressCache = createSelector(
  [getPersistAccount, getSelectedWalletKey],
  (account, selectedWalletKey) => {
    return account.addressCache[selectedWalletKey]
  }
)

export const getActiveBlockchainListByType = (walletType) => {
  switch (walletType) {
    case WALLET_TYPE_TREZOR:
    case WALLET_TYPE_TREZOR_MOCK:
      return TREZOR_ACTIVE_BLOCKCHAINS

    default:
      return DEFAULT_ACTIVE_BLOCKCHAINS
  }
}
