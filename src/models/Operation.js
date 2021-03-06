import {Record as record} from 'immutable';
import BigNumber from 'bignumber.js';

const functionNames = {'f08bf823': 'setLOCStatus', '8297b11a': 'removeLOC', '5f7b68be': 'addKey',
    '4b21cc22': 'setLOCValue', '5ae7ab32': 'revokeKey', 'e0873c06': 'reissueAsset'};
const Operations = [/*'createLOC'*/'no_type', 'editLOC', 'addLOC', 'removeLOC', 'editMint', 'changeReq'];

class Operation extends record({
    operation: '',
    type: null,
    needed: new BigNumber(0),
    // description: '',
    hasConfirmed: null,
    data: '',
}) {
    type() {
        let type = this.get('type');

        if (type === null){
            return 'empty_type';
        }

        type = type.toNumber();

        if (type >= Operations.length){
            return 'type:' + type;
        }

        return Operations[type];
    }

    needed() {
        return this.get('needed').toNumber();
    }

    functionName() {
        const data = this.get('data');
        const hash = data.slice(2, 10);
        return functionNames[hash] || hash;
    }

    targetAddress() {
        const data = this.get('data');
        const address = data.slice(34, 74)
        return +address === 0 ? '' : '0x' + address;
    }

    functionArgs() {
        const data = this.get('data');
        const argsStr = data.slice(74);
        let argsArr = argsStr.match(/.{1,64}/g);
        if (argsArr) {
            argsArr = argsArr.map( item => parseInt(item, 16) );
            return argsArr.join(', ');
        }
        return "";
    }

    // description() {
    //     let description = this.get('description');
    //     return description ? description : this.functionName();
    // }
    //
}

export default Operation;