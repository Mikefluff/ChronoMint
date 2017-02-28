import AppDAO from '../../../dao/AppDAO';
import {createPendingAction, updatePendingAction, removePendingAction} from './reducer';
import {store} from '../../configureStore';
// import {loadLOC} from '../locs/data';
import {removeLOCfromStore} from '../locs/locs';
import {notify} from '../../../redux/ducks/notifier/notifier';
import PendingOperationNoticeModel from '../../../models/notices/PendingOperationNoticeModel';

//const Status = {maintenance:0, active:1, suspended:2, bankrupt:3};

const operationExists = (operation) => {
    return !!store.getState().get('pendings').get(operation);
};

const addPendingToStore = (operation) => {
    store.dispatch(createPendingAction({operation}));
};

const updatePendingPropInStore = (operation, valueName, value) => {
    store.dispatch(updatePendingAction({valueName, value, operation}));
};

const updateNewPending = (operation, account) => {
    const callback = (valueName, value) => {
        updatePendingPropInStore(operation, valueName, value);
    };

    AppDAO.getTxsType(operation, account).then(type => callback('type', type));
    AppDAO.getTxsData(operation, account).then(data => callback('data', data));
};

const removePendingFromStore = (operation) => {
    store.dispatch(removePendingAction({operation}));
};

const updateExistingPending = (operation, account) => {
    const callback = (valueName, value) => {
        updatePendingPropInStore(operation, valueName, value);
    };
    AppDAO.hasConfirmed(operation, account, account).then(hasConfirmed => callback('hasConfirmed', hasConfirmed));
};

const handlePending = (operation, account) => {
    const callback = (needed) => {
        if (!needed.toNumber()) {
            let operationObj = store.getState().get('pendings').get(operation);
            if (operationObj && operationObj.targetAddress()) {
                AppDAO.getLOCs(account).then(
                    r => {
                        const addr = operationObj.targetAddress();
                        if (r.includes(addr)) {
                            // loadLOC(addr)
                        } else {
                            removeLOCfromStore(addr);
                        }
                        // r.forEach(loadLOC)
                    }
                );
            }
            removePendingFromStore(operation);
            return operationObj
        }
        if (!operationExists(operation)) {
            addPendingToStore(operation);
            updateNewPending(operation, account)
        }
        updatePendingPropInStore(operation, 'needed', needed);
        updateExistingPending(operation, account);
        return store.getState().get('pendings').get(operation)
    };

    return AppDAO.pendingYetNeeded(operation, account).then(needed => callback(needed));
};

const getPendings = (account) => {
    AppDAO.pendingsCount(account).then(count => {
        for (let i = 0; i < count.toNumber(); i++) {
            AppDAO.pendingById(i, account).then((operation) => {
                handlePending(operation, account);
            })
        }
    });
};

const revoke = (data, account) => {
    AppDAO.revoke(data['operation'], account);
};

const confirm = (data, account) => {
    AppDAO.confirm(data['operation'], account);
};

const handleConfirmOperation = (operation, account) => (dispatch) => {
    handlePending(operation, account).then((pending) => {
        if (pending) {
            dispatch(notify(new PendingOperationNoticeModel({pending})))
        }
    })
};

const handleRevokeOperation = (operation, account) => (dispatch) => {
    handlePending(operation, account).then((pending) => {
            dispatch(notify(new PendingOperationNoticeModel({pending, revoke: true})))
        }
    )
};

// getPendings(localStorage.chronoBankAccount); moved to app

export {
    revoke,
    confirm,
    // getPendings,
    // handleConfirmOperation,
    // handleRevokeOperation,
}