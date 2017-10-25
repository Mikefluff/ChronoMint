import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { CSSTransitionGroup } from 'react-transition-group'
import ModalDialog from 'components/dialogs/ModalDialog'
import { modalsClose } from 'redux/modals/actions'
import RevokeForm from './RevokeForm'

const TRANSITION_TIMEOUT = 250

function mapStateToProps (/*state*/) {
  return {}
}

function mapDispatchToProps (dispatch) {
  return {
    onClose: () => dispatch(modalsClose()),
    onSubmitSuccess: () => {
      dispatch(modalsClose())
    },
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class RevokeDialog extends React.Component {
  static propTypes = {
    onSubmitSuccess: PropTypes.func,
    onClose: PropTypes.func,
    closeModal: PropTypes.func,
  }

  render () {
    return (
      <CSSTransitionGroup
        transitionName='transition-opacity'
        transitionAppear
        transitionAppearTimeout={TRANSITION_TIMEOUT}
        transitionEnterTimeout={TRANSITION_TIMEOUT}
        transitionLeaveTimeout={TRANSITION_TIMEOUT}
      >
        <ModalDialog onClose={() => this.props.onClose()}>
          <RevokeForm
            onSubmitSuccess={this.props.onSubmitSuccess}
          />
        </ModalDialog>
      </CSSTransitionGroup>
    )
  }
}
