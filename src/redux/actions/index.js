import * as actionTypes from './type';

// user actions
export const setUser = user => ({
    type: actionTypes.SET_USER,
    data: {
        currentUser: user,
    }
})

export const clearUser = () => ({
    type: actionTypes.CLEAR_USER,
})

// Channel actions 

export const setCurrentChannel = channel => ({
    type: actionTypes.SET_CURRENT_CHANNEL,
    data: channel,
})

export const setPrivateChannel = isPrivateChannel => ({
      type: actionTypes.SET_PRIVATE_CHANNEL,
      data: isPrivateChannel,
  });