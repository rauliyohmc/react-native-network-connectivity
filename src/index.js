module.exports = {
  get reducer() {
    return require('./reducer').default;
  },
  get withNetworkConnectivity() {
    return require('./withNetworkConnectivity').default;
  },
  get ConnectivityRenderer() {
    return require('./ConnectivityRenderer').default;
  },
  get createNetworkMiddleware() {
    return require('./createNetworkMiddleware').default;
  },
  get offlineActionTypes() {
    return require('./actionTypes').default;
  },
  get checkInternetAccess() {
    return require('./checkInternetAccess').default;
  },
  get actionCreators() {
    return require('./actionCreators');
  },
  get networkEventsListenerSaga() {
    return require('./sagas').default;
  },
};
