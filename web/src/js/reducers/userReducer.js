
export const user = (state = {
    username: '',
    password: ''
}, action) => {
  switch (action.type) {
      case 'CONNECT_USER':
          state = {...state, username: action.payload};
          break;
      case 'CONNECTION_FULFILLED':
          //TODO
          break;
      case 'CONNECION_FAILED':
          //TODO
          break;
      case 'USER_REGISTERS':
          //TODO
          break;
      case 'CHANGE_PASSWORD':
          //TODO
          break;
      case 'PASSORD_CHANGED':
          //TODO
          break;
      default:
          //TODO
          break;
  }

  return {...state};
};