/* @flow */

import { get, isEqual, find, without } from 'lodash';
import actionTypes from './actionTypes';
import type { FluxAction, NetworkState } from './types';

export const initialState = {
  isConnected: true,
  actionQueue: []
};

function handleOfflineAction(
  state,
  { payload: { prevAction, prevThunk } = {}, meta = {} }
) {
  const isActionWithRetry =
    typeof prevAction === 'object' && get(meta, 'retry') === true;
  const isThunkWithRetry =
    typeof prevThunk === 'function' && get(prevThunk, 'meta.retry') === true;
  if (isActionWithRetry || isThunkWithRetry) {
    // If a similar action already existed on the queue, we remove it and append it again to the end of the queue
    const actionToLookUp = prevAction || prevThunk;
    const actionWithMeta = typeof actionToLookUp === 'object'
      ? { ...actionToLookUp, meta }
      : actionToLookUp;
    const similarActionQueued = find(state.actionQueue, action =>
      isEqual(action, actionWithMeta)
    );
    if (similarActionQueued) {
      return {
        ...state,
        actionQueue: [
          ...without(state.actionQueue, similarActionQueued),
          actionWithMeta
        ]
      };
    }
    return {
      ...state,
      actionQueue: [...state.actionQueue, actionWithMeta]
    };
  }
  return state;
}

function handleRemoveActionFromQueue(state, action) {
  const dummyAction = {
    type: 'Dummy'
  };

  const similarActionQueued =
    find(state.actionQueue, a => isEqual(action, a)) || dummyAction; // To prevent Flow from yelling at us
  return {
    ...state,
    actionQueue: without(state.actionQueue, similarActionQueued)
  };
}

function dismissActionsFromQueue(state, triggerActionToDismiss) {
  const newActionQueue = state.actionQueue.filter(action => {
    const dismissArray = get(action, 'meta.dismiss', []);
    return !dismissArray.includes(triggerActionToDismiss);
  });
  return {
    ...state,
    actionQueue: newActionQueue
  };
}

export default function(
  state: NetworkState = initialState,
  action: FluxAction
) {
  switch (action.type) {
    case actionTypes.CONNECTION_CHANGE:
      return {
        ...state,
        isConnected: action.payload
      };
    case actionTypes.FETCH_OFFLINE_MODE:
      return handleOfflineAction(state, action);
    case actionTypes.REMOVE_FROM_ACTION_QUEUE:
      return handleRemoveActionFromQueue(state, action.payload);
    case actionTypes.DISMISS_ACTIONS_FROM_QUEUE:
      return dismissActionsFromQueue(state, action.payload);
    default:
      return state;
  }
}
