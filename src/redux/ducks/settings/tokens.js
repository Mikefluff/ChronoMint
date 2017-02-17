import {Map} from 'immutable';
import {showSettingsTokenViewModal} from '../../../redux/ducks/ui/modal';
import {showSettingsTokenModal} from '../../../redux/ducks/ui/modal';
import TokenModel from '../../../models/TokenModel';
import AppDAO from '../../../dao/AppDAO';
import PlatformDAO from '../../../dao/PlatformDAO';
import TimeProxyDAO from '../../../dao/TimeProxyDAO';
import LHTProxyDAO from '../../../dao/LHTProxyDAO';

const TOKENS_LIST = 'settings/TOKENS_LIST';
const TOKENS_VIEW = 'settings/TOKENS_VIEW';
const TOKENS_BALANCES_NUM = 'settings/TOKENS_BALANCES_NUM';
const TOKENS_BALANCES = 'settings/TOKENS_BALANCES';
const TOKENS_FORM = 'settings/TOKENS_FORM';
const TOKENS_WATCH_UPDATE = 'settings/TOKENS_WATCH_UPDATE';
const TOKENS_ERROR = 'settings/TOKENS_ERROR';
const TOKENS_HIDE_ERROR = 'settings/TOKENS_HIDE_ERROR';

const initialState = {
    list: new Map,
    selected: new TokenModel, // for modify & view purposes
    balances: new Map,
    balancesNum: 0,
    balancesPageCount: 0,
    error: false // or error contract address
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case TOKENS_LIST:
            return {
                ...state,
                list: action.list
            };
        case TOKENS_VIEW:
        case TOKENS_FORM:
            return {
                ...state,
                selected: action.token
            };
        case TOKENS_BALANCES_NUM:
            return {
                ...state,
                balancesNum: action.num,
                balancesPageCount: action.pages
            };
        case TOKENS_BALANCES:
            return {
                ...state,
                balances: action.balances
            };
        case TOKENS_WATCH_UPDATE:
            return {
                ...state,
                list: action.notExist ? state.list.delete(action.token.address())
                                      : state.list.set(action.token.address(), action.token)
            };
        case TOKENS_ERROR:
            return {
                ...state,
                error: action.address
            };
        case TOKENS_HIDE_ERROR:
            return {
                ...state,
                error: false
            };
        default:
            return state;
    }
};

const listTokens = () => (dispatch) => {
    // TODO Code below is temporary and will be refactored when ChronoMint contract will allow to get tokens list
    TimeProxyDAO.getAddress().then(timeAddress => {
        TimeProxyDAO.getName().then(timeName => {
            TimeProxyDAO.getSymbol().then(timeSymbol => {
                LHTProxyDAO.getAddress().then(lhtAddress => {
                    LHTProxyDAO.getName().then(lhtName => {
                        LHTProxyDAO.getSymbol().then(lhtSymbol => {
                            let tokens = new Map;
                            tokens = tokens.set(timeSymbol, new TokenModel({
                                name: timeName,
                                address: timeAddress,
                                symbol: timeSymbol
                            }));
                            tokens = tokens.set(lhtSymbol, new TokenModel({
                                name: lhtName,
                                address: lhtAddress,
                                symbol: lhtSymbol
                            }));

                            dispatch({type: TOKENS_LIST, list: tokens});
                        });
                    });
                });
            });
        });
    });
};

const viewToken = (token: TokenModel) => (dispatch) => {
    AppDAO.initProxy(token.address()).then(proxy => {
        proxy.totalSupply().then(supply => {
            token = token.set('totalSupply', supply);
            dispatch({type: TOKENS_VIEW, token});
            dispatch(listBalances(token));
            dispatch(showSettingsTokenViewModal());
        });
    }, () => dispatch(errorToken(token.address())));
};

const listBalances = (token: TokenModel, page = 0, address = null) => (dispatch) => {
    let balances = new Map;
    balances = balances.set('Loading...', null);
    dispatch({type: TOKENS_BALANCES, balances});

    if (address === null) {
        let perPage = 100;
        PlatformDAO.getHoldersCount().then(balancesNum => {
            dispatch({type: TOKENS_BALANCES_NUM, num: balancesNum, pages: Math.ceil(balancesNum / perPage)});
            AppDAO.getTokenBalances(token.symbol(), page * perPage, perPage).then(balances => {
                dispatch({type: TOKENS_BALANCES, balances});
            });
        });
    } else {
        dispatch({type: TOKENS_BALANCES_NUM, num: 1, pages: 0});
        balances = new Map;
        if (/^0x[0-9a-f]{40}$/i.test(address)) {
            AppDAO.initProxy(token.address()).then(proxy => {
                proxy.getAccountBalance(address).then(balance => {
                    balances = balances.set(address, balance.toNumber());
                    dispatch({type: TOKENS_BALANCES, balances});
                });
            }, () => dispatch(errorToken(token.address())));
        } else {
            dispatch({type: TOKENS_BALANCES, balances});
        }
    }
};

const formToken = (token: TokenModel) => (dispatch) => {
    dispatch({type: TOKENS_FORM, token});
    dispatch(showSettingsTokenModal());
};

const treatToken = (current: TokenModel, updated: TokenModel, account) => (dispatch) => {
    AppDAO.treatToken(current, updated, account).then(result => {
        if (!result) { // success result will be watched so we need to process only false
            dispatch(errorToken(updated.address()));
        }
    });
};

const watchUpdateToken = (token: TokenModel, notExist: boolean) => ({type: TOKENS_WATCH_UPDATE, token, notExist});
const errorToken = (address: string) => ({type: TOKENS_ERROR, address});
const hideError = () => ({type: TOKENS_HIDE_ERROR});

export {
    listTokens,
    viewToken,
    listBalances,
    formToken,
    treatToken,
    watchUpdateToken,
    hideError
}

export default reducer;