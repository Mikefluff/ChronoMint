import PropTypes from 'prop-types'
import AbstractAccountModel from './AbstractAccountModel'
import AccountEntryModel from './AccountEntryModel'

const schema = {
  wallet: PropTypes.object,
  entry: PropTypes.instanceOf(AccountEntryModel),
}

class AccountModel extends AbstractAccountModel {
  constructor (props) {
    super(props, schema)
    Object.assign(this, props)
    Object.freeze(this)
  }
}

export default AccountModel
