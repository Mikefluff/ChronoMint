/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { Paper } from '@material-ui/core'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import ExchangeWidget from 'components/exchange/ExchangeWidget/ExchangeWidget'
import ExchangesTable from 'components/exchange/ExchangesTable/ExchangesTable'
import { watchExchanges } from '@chronobank/core/redux/exchange/actions'
import './ExchangeContent.scss'

const mapDispatchToProps = (dispatch) => ({
  init: () => dispatch(watchExchanges()),
})

@connect(null, mapDispatchToProps)
export default class ExchangeContent extends Component {
  static propTypes = {
    init: PropTypes.func,
  }

  componentWillMount () {
    this.props.init()
  }

  render () {
    return (
      <div styleName='root'>
        <div styleName='content'>
          <div styleName='inner'>
            <div className='ExchangeContent__grid'>
              <div className='row'>
                <div className='col-xs-6'>
                  <div styleName='exchangeBox'>
                    <Paper>
                      <ExchangeWidget />
                      <ExchangesTable />
                    </Paper>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}