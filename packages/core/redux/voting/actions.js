/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import type PollDetailsModel from '../../models/PollDetailsModel'

import {
  POLLS_CREATE,
  POLLS_LIST,
  POLLS_LOAD,
  POLLS_REMOVE,
  POLLS_UPDATE,
  POLLS_VOTE_LIMIT,
} from './constants'

export const handlePollCreated = (poll: PollDetailsModel) => async (dispatch) => {
  dispatch({
    type: POLLS_CREATE,
    poll,
  })
}

export const handlePollRemoved = (id: number) => async (dispatch) => {
  dispatch({
    type: POLLS_REMOVE,
    id,
  })
}

export const handlePollUpdated = (poll: PollDetailsModel) => async (dispatch) => {
  dispatch({
    type: POLLS_UPDATE,
    poll,
  })
}

export const pollsLoad = () => (dispatch) =>
  dispatch({
    type: POLLS_LOAD,
  })

export const pollsList = (list) => (dispatch) =>
  dispatch({
    type: POLLS_LIST,
    list,
  })

export const setPollVoteLimit = (voteLimitInTIME, voteLimitInPercent) => (dispatch) =>
  dispatch({
    type: POLLS_VOTE_LIMIT,
    voteLimitInTIME,
    voteLimitInPercent,
  })
