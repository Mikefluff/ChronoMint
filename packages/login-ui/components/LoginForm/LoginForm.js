/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import compose from 'recompose/compose'
import React from 'react'
import { Link } from 'react-router'
import { Field, formValueSelector, reduxForm } from 'redux-form/immutable'
import { TextField } from 'redux-form-material-ui'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import Button from 'components/common/ui/Button/Button'
import UserRow from 'components/common/ui/UserRow/UserRow'

import {
  DUCK_NETWORK,
  FORM_LOGIN_PAGE,
  FORM_LOGIN_PAGE_FIELD_SUCCESS_MESSAGE,
  initAccountsSignature,
  initLoginPage,
  navigateToSelectWallet,
  onSubmitLoginForm,
  onSubmitLoginFormFail,
} from '@chronobank/login/redux/network/actions'
import { isLocalNode } from '@chronobank/login/network/settings'
import { DUCK_PERSIST_ACCOUNT } from '@chronobank/core/redux/persistAccount/actions'
import { getAccountAddress, getAccountAvatar, getAccountAvatarImg, getAccountName } from '@chronobank/core/redux/persistAccount/utils'

import styles from 'layouts/Splash/styles'
import spinner from 'assets/img/spinningwheel-1.gif'
import './LoginForm.scss'

function mapStateToProps (state) {
  const network = state.get(DUCK_NETWORK)
  const selectedWallet = state.get(DUCK_PERSIST_ACCOUNT).selectedWallet
  const formSelector = formValueSelector(FORM_LOGIN_PAGE)

  return {
    selectedWallet: selectedWallet,
    isLoginSubmitting: network.isLoginSubmitting,
    selectedNetworkId: network.selectedNetworkId,
    selectedProvider: network.selectedProviderId,
    selectedAccount: network.selectedAccount,
    accounts: network.accounts,
    isLocalNode: isLocalNode(network.selectedProviderId, network.selectedNetworkId),
    successMessage: formSelector(state, FORM_LOGIN_PAGE_FIELD_SUCCESS_MESSAGE),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    onSubmit: async (values) => {
      const password = values.get('password')

      await dispatch(onSubmitLoginForm(password))
    },
    onSubmitFail: (errors, dispatch, submitErrors) => dispatch(onSubmitLoginFormFail(errors, dispatch, submitErrors)),
    initLoginPage: async () => dispatch(initLoginPage()),
    navigateToSelectWallet: () => dispatch(navigateToSelectWallet()),
    initAccountsSignature: () => dispatch(initAccountsSignature()),
  }
}

class LoginPage extends React.Component {
  static propTypes = {
    initLoginPage: PropTypes.func,
    navigateToSelectWallet: PropTypes.func,
    isLoginSubmitting: PropTypes.bool,
    initAccountsSignature: PropTypes.func,
    accounts: PropTypes.array,
    selectedAccount: PropTypes.string,
    selectedWallet: PropTypes.object,
    isLocalNode: PropTypes.bool,
    successMessage: PropTypes.string,
  }

  componentWillMount () {
    this.props.initLoginPage()
  }

  renderSuccessMessage () {
    const { successMessage } = this.props

    if (!successMessage) {
      return null
    }

    return (
      <div styleName='success-message'>
        {successMessage}
      </div>
    )
  }

  render () {
    const {
      handleSubmit, pristine, valid, initialValues, isImportMode, error, onSubmit, selectedWallet,
      navigateToSelectWallet, isLoginSubmitting, isLocalNode, classes,
    } = this.props

    return (
      <form styleName='form' name={FORM_LOGIN_PAGE} onSubmit={handleSubmit}>
        <div styleName='page-title'>
          <Translate value='LoginForm.title' />
        </div>

        {this.renderSuccessMessage()}

        <input type='hidden' name={FORM_LOGIN_PAGE_FIELD_SUCCESS_MESSAGE} />

        <div styleName='user-row'>
          <UserRow
            title={getAccountName(selectedWallet)}
            subtitle={getAccountAddress(selectedWallet, true)}
            avatar={getAccountAvatarImg(selectedWallet)}
            onClick={navigateToSelectWallet}
            linkTitle='My Accounts'
          />

          <div styleName='field'>
            <Field
              component={TextField}
              name='password'
              type='password'
              label={<Translate value='LoginForm.enterPassword' />}
              fullWidth
              InputProps={{ className: classes.input }}
              InputLabelProps={{ className: classes.floatingLabel }}
              style={{ className: classes.hint }}
            />
          </div>

          <div styleName='actions'>
            <Button
              styleName='button'
              buttonType='login'
              type='submit'
              label={isLoginSubmitting
                ? (
                  <span styleName='spinner-wrapper'>
                    <img
                      src={spinner}
                      alt=''
                      width={24}
                      height={24}
                    />
                  </span>
                )
                : <Translate value='LoginForm.submitButton' />}
              disabled={isLoginSubmitting}
            />

            {error ? (<div styleName='form-error'>{error}</div>) : null}

            <Link to='/login/recover-account' href styleName='link'>
              <Translate value='LoginForm.forgotPassword' />
            </Link>
          </div>
        </div>

      </form>
    )
  }
}

const form = reduxForm({ form: FORM_LOGIN_PAGE })(LoginPage)
export default compose(withStyles(styles), connect(mapStateToProps, mapDispatchToProps))(form)
