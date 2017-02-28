import TimeProxyDAO from '../../../dao/TimeProxyDAO';
// import LHTProxyDAO from '../../../dao/LHTProxyDAO';todo
import {
    setTimeBalanceStart,
    setTimeBalanceSuccess,
    setLHTBalanceStart,
    setLHTBalanceSuccess,
    setETHBalanceStart,
    setETHBalanceSuccess
} from './reducer';

const updateTimeBalance = () => (dispatch) => {
    dispatch(setTimeBalanceStart());
    TimeProxyDAO.getAccountBalance(localStorage.getItem('chronoBankAccount'))
        .then(balance => dispatch(setTimeBalanceSuccess(balance.toNumber())));
};

const updateLHTBalance = () => (dispatch) => {
    dispatch(setLHTBalanceStart());
    // LHTProxyDAO.getAccountBalance(localStorage.getItem('chronoBankAccount'))todo
    //     .then(balance => {
    //         dispatch(setLHTBalanceSuccess(balance.toNumber()))
    //     });
};

const updateETHBalance = () => (dispatch) => {
    dispatch(setETHBalanceStart());
    TimeProxyDAO.web3.eth.getBalance(localStorage.getItem('chronoBankAccount'), (e, balance) => {
        dispatch(setETHBalanceSuccess(balance.toNumber()));
    });
};

const transferEth = (amount, recipient) => (dispatch) => {
    // LHTProxyDAO.web3.eth.sendTransaction({todo
    //     from: localStorage.getItem('chronoBankAccount'),
    //     to: recipient,
    //     value: LHTProxyDAO.web3.toWei(parseFloat(amount, 10), "ether")
    // });

    dispatch(updateETHBalance());
};

const transferLht = (amount, recipient) => (dispatch) => {
    dispatch(setLHTBalanceStart());
    // LHTProxyDAO.transfer(amount, recipient, localStorage.getItem('chronoBankAccount'))todo
    //     .then(() => dispatch(updateLHTBalance()));
};

const transferTime = (amount, recipient) => (dispatch) => {
    dispatch(setTimeBalanceStart());
    TimeProxyDAO.transfer(amount, recipient, localStorage.getItem('chronoBankAccount'))
        .then(() => dispatch(updateTimeBalance()));
};

export {
    updateTimeBalance,
    updateLHTBalance,
    updateETHBalance,
    transferEth,
    transferLht,
    transferTime
}

