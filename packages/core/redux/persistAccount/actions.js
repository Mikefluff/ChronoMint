/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import uuid from 'uuid/v1'
import hdkey from 'ethereumjs-wallet/hdkey'
import bip39 from 'bip39'
import Accounts from 'web3-eth-accounts'
import {
  AccountEntryModel,
  AccountProfileModel,
  AccountCustomNetwork,
} from '../../models/wallet/persistAccount'
import {
  getWalletsListAddresses,
  getAccountAddress,
} from '@chronobank/core/redux/persistAccount/utils'
import networkService from '@chronobank/login/network/NetworkService'
import profileService from '@chronobank/login/network/ProfileService'
import web3Provider from '@chronobank/login/network/Web3Provider'
import web3Utils from '@chronobank/login/network/Web3Utils'
import mnemonicProvider from '@chronobank/login/network/mnemonicProvider'

export const WALLETS_ADD = 'persistAccount/WALLETS_ADD'
export const WALLETS_SELECT = 'persistAccount/WALLETS_SELECT'
export const WALLETS_LOAD = 'persistAccount/WALLETS_LOAD'
export const WALLETS_UPDATE_LIST = 'persistAccount/WALLETS_UPDATE_LIST'
export const WALLETS_REMOVE = 'persistAccount/WALLETS_REMOVE'
export const CUSTOM_NETWORKS_LIST_ADD = 'persistAccount/CUSTOM_NETWORKS_LIST_ADD'
export const CUSTOM_NETWORKS_LIST_UPDATE = 'persistAccount/CUSTOM_NETWORKS_LIST_UPDATE'
export const CUSTOM_NETWORKS_LIST_RESET = 'persistAccount/CUSTOM_NETWORKS_LIST_RESET'

export const DUCK_PERSIST_ACCOUNT = 'persistAccount'

export const COIN_TYPE_ETH = 60
export const WALLET_HD_PATH = `m/44'/${COIN_TYPE_ETH}'/0'/0/0`

export const accountAdd = (wallet) => (dispatch) => {
  dispatch({ type: WALLETS_ADD, wallet })
}

export const accountSelect = (wallet) => (dispatch) => {
  dispatch({ type: WALLETS_SELECT, wallet })
}

export const accountLoad = (wallet) => (dispatch) => {
  dispatch({ type: WALLETS_LOAD, wallet })
}

export const accountUpdateList = (walletList) => (dispatch) => {
  dispatch({ type: WALLETS_UPDATE_LIST, walletList })
}

export const accountUpdate = (wallet) => (dispatch, getState) => {
  const state = getState()

  const { walletsList } = state.get(DUCK_PERSIST_ACCOUNT)

  let index = walletsList.findIndex((item) => item.key === wallet.key)

  let copyWalletList = [...walletsList]

  copyWalletList.splice(index, 1, wallet)

  dispatch({ type: WALLETS_UPDATE_LIST, walletsList: copyWalletList })

}

export const decryptAccount = (encrypted, password) => async () => {
  const accounts = new Accounts()
  await accounts.wallet.clear()
  console.log('en', encrypted, password)

  let wallet = await accounts.wallet.decrypt(encrypted, password)

  return wallet

}

export const validateAccountName = (name) => (dispatch, getState) => {
  const state = getState()

  const { walletsList } = state.get(DUCK_PERSIST_ACCOUNT)

  return !walletsList.find((item) => item.name === name)
}

export const validateMnemonicForAccount = (wallet, mnemonic) => async () => {
  const accounts = new Accounts()
  accounts.wallet.clear()

  const addressFromWallet = wallet && getAccountAddress(wallet, true)

  const account = accounts.privateKeyToAccount(hdkey.fromMasterSeed(bip39.mnemonicToSeed(mnemonic)).derivePath(WALLET_HD_PATH).getWallet().getPrivateKeyString())
  const address = account && account.address && account.address.toLowerCase()

  return addressFromWallet === address
}

export const resetPasswordAccount = (wallet, mnemonic, password) => async (dispatch) => {
  const accounts = new Accounts()
  accounts.wallet.clear()

  const newCopy = await dispatch(createAccount({ name: wallet.name, mnemonic, password }))

  let newWallet = {
    ...wallet,
    encrypted: newCopy.encrypted,
  }

  dispatch(accountUpdate(newWallet))

  dispatch(accountSelect(newWallet))

}

export const createAccount = ({ name, password, privateKey, mnemonic, numberOfAccounts = 0, types = {} }) => async (dispatch, getState) => {
  let wallet, hex
  if (privateKey.startsWith(xpriv)) {
    walllet, hex = hdkey.fromExtendedPrivateKey(privateKey).derivePath(WALLET_HD_PATH).getWallet().getPrivateKeyString()
  } else if (privateKey.length == 32) {
    let wallet, hex = privateKey 
  } else if (mnemonic)
    let wallet, hex = hdkey.fromMasterSeed(bip39.mnemonicToSeed(mnemonic)).derivePath(WALLET_HD_PATH).getWallet().getPrivateKeyString() 
  } else {
    //TODO add error handler (mikefluff)	  
    return
  }
  // const web3 = new Web3()
  // web3Provider.reinit(web3, web3Utils.createStatusEngine(settings))
  // web3Provider.resolve()
  console.log('hex', hex, mnemonic, privateKey, password)


  const accounts = new Accounts()

  wallet = await accounts.wallet.create(numberOfAccounts)
  const account = accounts.privateKeyToAccount(hex)
  wallet.add(account)
  console.log('hex', hex, account)
  console.log(wallet.encrypt(password))

  const entry = new AccountEntryModel({
    key: uuid(),
    name,
    types,
    encrypted: wallet && wallet.encrypt(password),
    address: account.address 
    profile: null,
  })

  const newAccounts = await dispatch(setProfilesForAccounts([entry]))

  return newAccounts[0] || entry

}

export const createHWAccount = ({ name, address, types = {} }) => async (dispatch, getState) => {
  const state = getState()

  let wallet, hex = privateKey || hdkey.fromMasterSeed(bip39.mnemonicToSeed(mnemonic)).derivePath(WALLET_HD_PATH).getWallet().getPrivateKeyString() || ''

  const accounts = new Accounts()
  accounts.wallet.clear()

  wallet = await accounts.wallet.create(numberOfAccounts)
  const account = accounts.privateKeyToAccount(hex)
  wallet.add(account)

  const entry = new AccountEntryModel({
    key: uuid(),
    name,
    types,
    encrypted: wallet && wallet.encrypt(password),
    profile: null,
  })

  const newAccounts = await dispatch(setProfilesForAccounts([entry]))

  return newAccounts[0] || entry

}

export const downloadWallet = () => (dispatch, getState) => {
  const state = getState()

  const { selectedWallet } = state.get(DUCK_PERSIST_ACCOUNT)

  if (selectedWallet) {
    const walletName = selectedWallet.name || 'Wallet'
    const text = JSON.stringify(selectedWallet.encrypted.length > 1 ? selectedWallet.encrypted : selectedWallet.encrypted[0])
    const element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
    element.setAttribute('download', `${walletName}.wlt`)
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }
}

export const setProfilesForAccounts = (walletsList) => async () => {

  const addresses = getWalletsListAddresses(walletsList)
  const { data } = await profileService.getPersonInfo(addresses)

  if (Array.isArray(data)) {
    return data.reduce((prev, profile) => {

      const updatedProfileAccounts =
        walletsList
          .filter((wallet) => getAccountAddress(wallet, true) === profile.address)
          .map((account) => {
            const profileModel = profile && new AccountProfileModel(profile) || null
            return new AccountEntryModel({
              ...account,
              profile: profileModel,
            })

          })

      return [].concat(prev, updatedProfileAccounts)
    }, [])
  } else {
    return walletsList
  }
}

export const logout = () => (dispatch) => {
  dispatch(accountSelect(null))
  dispatch(accountLoad(null))
  // Router.pushRoute('/')
}

export const customNetworkCreate = (url, alias) => (dispatch) => {
  const network = new AccountCustomNetwork({
    id: uuid(),
    name: alias,
    url,
  })

  dispatch(customNetworksListAdd(network))
}

export const customNetworkEdit = (network: AccountCustomNetwork) => (dispatch, getState) => {
  const state = getState()

  const { customNetworksList } = state.get(DUCK_PERSIST_ACCOUNT)

  const foundNetworkIndex = customNetworksList.findIndex((item) => network.id === item.id)

  if (foundNetworkIndex !== -1) {
    let copyNetworksList = [...customNetworksList]

    copyNetworksList.splice(foundNetworkIndex, 1, network)

    dispatch(customNetworksListUpdate(copyNetworksList))
  }
}

export const customNetworksListAdd = (network: AccountCustomNetwork) => (dispatch) => {
  dispatch({ type: CUSTOM_NETWORKS_LIST_ADD, network })
}

export const customNetworksDelete = (network) => (dispatch, getState) => {
  const state = getState()

  const { customNetworksList } = state.get(DUCK_PERSIST_ACCOUNT)

  const updatedNetworkList = customNetworksList.filter((item) => item.id !== network.id)

  dispatch(customNetworksListUpdate(updatedNetworkList))
}

export const customNetworksListUpdate = (list) => (dispatch) => {
  dispatch({ type: CUSTOM_NETWORKS_LIST_UPDATE, list })
}

export const customNetworksListReset = () => (dispatch) => {
  dispatch({ type: CUSTOM_NETWORKS_LIST_RESET })
}
