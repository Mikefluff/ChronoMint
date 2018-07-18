/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { ContractModel } from '../models/index'

import {
  AssetsManagerABI,
  AssetHolderABI,
  // AssetDonatorABI,
  ContractsManagerABI,
  ERC20ManagerABI,
  MultiEventsHistoryABI,
  VotingManagerABI,
} from '../../../core/dao/abi/'

import ContractsManagerDAO from './lib/ContractsManagerDAO'
import AssetManagerLibraryDAO from './lib/AssetManagerLibraryDAO'
import AssetHolderDAO from '../../dao/AssetHolderDAO'
import ERC20ManagerDAO from '../../dao/ERC20ManagerDAO'
import VotingManagerDAO from '../../dao/VotingManagerDAO'
import PollInterfaceDAO from '../../dao/PollInterfaceDAO'
// import AssetDonatorDAO from '../../dao/AssetDonatorDAO'

export { default as ethDAO } from './lib/ETHDAO'
export { default as AbstractContractDAO } from './lib/AbstractContractDAO'
export { default as AbstractTokenDAO } from './lib/AbstractTokenDAO'
// export { default as EIP20TokenDAO } from './lib/EIP20TokenDAO'
export { default as ETHTokenDAO } from './lib/ETHTokenDAO'
export { default as ContractsManagerDAO } from './lib/ContractsManagerDAO'
export { default as ERC20LibraryDAO } from './lib/ERC20LibraryDAO'

console.log('VotingManagerDAO: ', VotingManagerDAO)
console.log('AssetManagerLibraryDAO: ', AssetManagerLibraryDAO)
console.log('AssetHolderDAO: ', AssetHolderDAO)

export const CONTRACTS_MANAGER = new ContractModel({
  type: 'ContractsManager',
  address: ContractsManagerABI.networks['4'].address, // @todo Add Network selection
  abi: ContractsManagerABI,
  DAOClass: ContractsManagerDAO,
})

export const ASSET_MANAGER_LIBRARY = new ContractModel({
  type: 'AssetManagerLibrary',
  abi: AssetsManagerABI,
  DAOClass: AssetManagerLibraryDAO,
})

// export const ASSET_DONATOR_LIBRARY = new ContractModel({
//   type: 'AssetDonator',
//   abi: AssetDonatorABI,
//   DAOClass: AssetDonatorDAO,
// })

export const ASSET_HOLDER_LIBRARY = new ContractModel({
  type: 'TimeHolder',
  abi: AssetHolderABI,
  DAOClass: AssetHolderDAO,
})

export const POLL_INTERFACE_MANAGER = new ContractModel({
  type: 'PollInterfaceManager',
  abi: AssetHolderABI,
  DAOClass: PollInterfaceDAO,
})

export const VOTING_MANAGER_LIBRARY = new ContractModel({
  type: 'VotingManager',
  abi: VotingManagerABI,
  DAOClass: VotingManagerDAO,
})

export const ERC20_MANAGER = new ContractModel({
  type: 'ERC20Manager',
  abi: ERC20ManagerABI,
  DAOClass: ERC20ManagerDAO,
})

export const MULTI_EVENTS_HISTORY = new ContractModel({
  type: 'MultiEventsHistory',
  abi: MultiEventsHistoryABI,
  DAOClass: null,
})
