import AppDAO from '../../../dao/AppDAO';
import LocDAO from '../../../dao/LocDAO';
import {updateLOCinStore, createLOCinStore} from './locs';
import {notify} from '../../../redux/ducks/notifier/notifier';
import LOCNoticeModel from '../../../models/notices/LOCNoticeModel';

const Setting = {locName: 0, website: 1, issueLimit: 3, publishedHash: 6, expDate: 7};
const SettingString = {locName: 0, website: 1, publishedHash: 6};
const account = localStorage.getItem('chronoBankAccount');

const loadLOC = (address) => {
    const loc = new LocDAO(address).contract;
    const account = localStorage.getItem('chronoBankAccount');

    const callback = (valueName, value) => {
        updateLOCinStore(valueName, value, address);
    };

    const LOCObject = createLOCinStore(address);

    for (let setting in Setting) {
        if (Setting.hasOwnProperty(setting)) {
            let operation;
            if (setting in SettingString) {
                operation = loc.getString;
            } else {
                operation = loc.getValue;
            }
            operation(Setting[setting], {from: account}).then(callback.bind(null, setting));
        }
    }
    return LOCObject;
};

const updateLOC = (data) => {
    let address = data['address'];
    let account = data['account'];

    // const callback = (valueName, value)=>{
    //     updateLOCinStore(valueName, value, address);
    // };
    //
    for (let settingName in Setting) {
        if (data[settingName] === undefined) continue;
        let value = data[settingName];
        let settingIndex = Setting[settingName];
        let operation;
        if (settingName in SettingString) {
            operation = AppDAO.setLOCString;
        } else {
            operation = AppDAO.setLOCValue;
        }
        //  TODO Add setLOCString event
        operation(address, settingIndex, value, account);//.then(
        //     () => callback(settingName, value)
        // );
    }
};

const reissueAsset = (data) => {
    let {address, issueAmount}  = data;

    // const callback = (valueName, value)=>{
    //     updateLOCinStore(valueName, value, address);
    // };
    //

    AppDAO.reissueAsset('LHT', issueAmount, address);//.then(
    //     () => callback(settingName, value)
    // );
};

const proposeLOC = (props) => {
    let {locName, website, issueLimit, publishedHash, expDate, account} = props;
    AppDAO.proposeLOC(locName, website, issueLimit, publishedHash, expDate, account)
        .catch(error => console.error(error));
};

const removeLOC = (address) => {
    AppDAO.removeLOC(address, localStorage.getItem('chronoBankAccount'));
};

const handleNewLOC = (address) => (dispatch) => {
    const loc = loadLOC(address);
    dispatch(notify(new LOCNoticeModel({loc})));
};

// AppDAO.getLOCs(account)
//     .then(r => r.forEach(loadLOC));

export {
    proposeLOC,
    updateLOC,
    removeLOC,
    loadLOC,
    reissueAsset,
    handleNewLOC,
}