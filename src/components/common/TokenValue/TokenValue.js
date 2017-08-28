import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { CircularProgress } from 'material-ui'
import BigNumber from 'bignumber.js'
import { integerWithDelimiter } from 'utils/formatter'
import './TokenValue.scss'

const mapStateToProps = (state) => {
  const {isInited, prices, selectedCurrency} = state.get('market')
  return {
    isInited,
    prices,
    selectedCurrency
  }
}

@connect(mapStateToProps, null)
class TokenValue extends Component {

  static propTypes = {
    value: PropTypes.object,
    symbol: PropTypes.string,
    className: PropTypes.string,
    prefix: PropTypes.string,
    isInvert: PropTypes.bool,
    isLoading: PropTypes.bool,
    prices: PropTypes.object,
    selectedCurrency: PropTypes.string,
    isInited: PropTypes.bool
  }

  getFraction (value: BigNumber) {
    const valueBN = new BigNumber(value)
    if (valueBN.gt(0)) {
      const fraction = valueBN.modulo(1)
      if (fraction.toNumber() !== 0) {
        const fractionString = ('' + fraction.toString()).slice(2)
        return `.${fractionString}`
      }
    }
    return '.00'
  }

  renderPrice () {
    const {prices, value, symbol, selectedCurrency, isInited} = this.props
    const price = isInited && prices[symbol] && prices[symbol][selectedCurrency] ? prices[symbol][selectedCurrency] : null
    if (price === null || price === 0) {
      return null
    }
    const valueInCurrency = integerWithDelimiter(value.mul(price), true)
    return (
      <span styleName='price'>{`(US$${valueInCurrency})`}</span>
    )
  }

  render () {
    const {value, isInvert, isLoading, symbol, prefix} = this.props
    const defaultMod = isInvert ? 'defaultInvert' : 'default'
    return isLoading ? (
      <CircularProgress size={24} />
    ) : (
      <span styleName={defaultMod} className='TokenValue__root'>
        {prefix}
        <span styleName='integral'>{integerWithDelimiter(value)}</span>
        <span styleName='fraction'>{this.getFraction(value)} {symbol}</span>
        {this.renderPrice()}
      </span>
    )
  }
}

export default TokenValue