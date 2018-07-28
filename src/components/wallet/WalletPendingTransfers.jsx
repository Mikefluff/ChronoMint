/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { Button } from 'components'
import Preloader from 'components/common/Preloader/Preloader'
import { Paper } from '@material-ui/core'
import Amount from '@chronobank/core/models/Amount'
import TokensCollection from '@chronobank/core/models/tokens/TokensCollection'
import MultisigWalletModel from '@chronobank/core/models/wallet/MultisigWalletModel'
import type MultisigWalletPendingTxModel from '@chronobank/core/models/wallet/MultisigWalletPendingTxModel'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { confirmMultisigTx, getPendingData, revokeMultisigTx } from '@chronobank/core/redux/multisigWallet/actions'
import { DUCK_ETH_MULTISIG_WALLET } from '@chronobank/core/redux/multisigWallet/constants'
import { DUCK_TOKENS } from '@chronobank/core/redux/tokens/constants'
import './WalletPendingTransfers.scss'

function mapStateToProps (state) {
  return {
    wallet: state.get(DUCK_ETH_MULTISIG_WALLET).selected(),
    tokens: state.get(DUCK_TOKENS),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    revoke: (wallet, tx) => dispatch(revokeMultisigTx(wallet, tx)),
    confirm: (wallet, tx) => dispatch(confirmMultisigTx(wallet, tx)),
    getPendingData: (wallet, pending) => dispatch(getPendingData(wallet, pending)),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class WalletPendingTransfers extends PureComponent {
  static propTypes = {
    wallet: PropTypes.instanceOf(MultisigWalletModel),
    revoke: PropTypes.func,
    confirm: PropTypes.func,
    getPendingData: PropTypes.func,
    tokens: PropTypes.instanceOf(TokensCollection),
  }

  componentWillMount () {
    this.checkAndFetchPendings(this.props.wallet)
  }

  componentWillReceiveProps ({ wallet }) {
    this.checkAndFetchPendings(wallet)
  }

  checkAndFetchPendings (wallet) {
    if (wallet.pendingTxList().isFetched() || wallet.pendingTxList().isFetching()) {
      return
    }

    wallet.pendingTxList().items().forEach((item) => {
      if (item.isFetched() || item.isFetching()) {
        return
      }
      this.props.getPendingData(wallet, item)
    })
  }

  handleRevoke = (wallet, item) => () => {
    this.props.revoke(wallet, item)
  }

  handleConfirm = (wallet, item) => () => {
    this.props.confirm(wallet, item)
  }

  renderRow (wallet, item: MultisigWalletPendingTxModel) {
    const isConfirmed = item.isConfirmed()

    return (
      <div styleName='row' key={item.id()}>
        {item.isPending()
          ? <Preloader />
          : (
            <div styleName='left'>
              <div styleName='itemTitle'>{item.title()}</div>
              {item.details().map((item, index) => {
                const value = item.value instanceof Amount
                  ? +this.props.tokens.getBySymbol(item.value.symbol()).removeDecimals(item.value)
                  : item.value
                return (
                  <div key={index} styleName='detail'>
                    <span styleName='detailKey'>{item.label}:</span>
                    <span styleName='detailValue'>{value}</span>
                  </div>
                )
              })}
            </div>
          )
        }
        <div styleName='right'>
          <div styleName='action'>
            <Button
              label={<Translate value='wallet.revoke' />}
              disabled={!isConfirmed}
              onClick={isConfirmed
                ? this.handleRevoke(wallet, item)
                : undefined
              }
            />
          </div>
          <Button
            label={<Translate value='wallet.sign' />}
            disabled={isConfirmed}
            onClick={!isConfirmed
              ? this.handleConfirm(wallet, item)
              : undefined
            }
          />
        </div>
      </div>
    )
  }

  renderTable () {
    const { wallet } = this.props
    return (
      <div>
        <div styleName='tableHead'>
          <div styleName='left'>
            <div styleName='tableHeadElem'><Translate value='wallet.transaction' /></div>
          </div>
          <div styleName='right'>
            <div styleName='tableHeadElem'><Translate value='wallet.actions' /></div>
          </div>
        </div>
        <div styleName='tableBody'>
          {wallet.pendingTxList().items().map((item) => this.renderRow(wallet, item))}
        </div>
      </div>
    )
  }

  render () {
    return (
      <Paper>
        <div styleName='header'>
          <div styleName='title'><Translate value='wallet.pendingTransfers' /></div>
        </div>
        <div styleName='body'>
          {!this.props.wallet
            ? <Preloader />
            : this.props.wallet.pendingTxList().size() > 0
              ? this.renderTable()
              : 'No transfers'
          }
        </div>
      </Paper>
    )
  }
}
