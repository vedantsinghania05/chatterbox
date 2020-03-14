const axios = require('axios')
let axiosInstance = axios.create();

const masterKey = 'LwwGrzyouCKOo1tv2AGBJKBRwYy6qfjA';
const nodeserverUrl = 'http://localhost:9000';

/**
 * Auth
 */
export const signInUser = (username, password, successCbk, errorCbk) => {
  axiosInstance.post(nodeserverUrl + '/auth',
    { access_token: masterKey },
    { auth: {
      username: username,
      password: password
    }}
  )
  .then(successCbk)
  .catch(errorCbk);
}

/**
 * Users
 */
export const createUser = (username, password, successCbk, errorCbk) => {
  axiosInstance.post(nodeserverUrl + '/users',
    {
      access_token: masterKey,
      email: username,
      password: password,
    },
  )
  .then(successCbk)
  .catch(errorCbk);
}

export const createGroup = (title, members, successCbk, errorCbk) => {
  console.log('>>>> nodeserverapi.js is working')
  axiosInstance.post(nodeserverUrl + '/groups',
    {
      access_token: masterKey,
      title: title,
      members: members
    },
  )
  .then(successCbk)
  .catch(errorCbk)
}

export const createMessage = (poster, group, content, successCbk, errorCbk) => {
  console.log('nodeserverapi is being called')
  axiosInstance.post(nodeserverUrl + '/messages',
    {
      access_token: masterKey,
      poster: poster,
      group: group,
      content: content
    }
  )
  .then(successCbk)
  .catch(errorCbk)
}

export const getAllUsers = (token, successCbk, errorCbk) => {
  axiosInstance.get(nodeserverUrl + '/users/',
    { headers: { Authorization: 'Bearer ' + token} }
  )
  .then(successCbk)
  .catch(errorCbk)
}

export const getAllGroups = (token, successCbk, errorCbk) => {
  axiosInstance.get(nodeserverUrl + '/groups/',
    { headers: { Authorization: 'Bearer ' + token } }
  )
  .then(successCbk)
  .catch(errorCbk)
}

export const getMessages = (token, group, skipCount, successCbk, errorCbk) => {
  axiosInstance.get(nodeserverUrl + '/messages?group=' + group + '&skipCount=' + skipCount,
    { headers: { Authorization: 'Bearer ' + token } }
  )
  .then(successCbk)
  .catch(errorCbk)
}

export const getUser = (id, token, successCbk, errorCbk) => {
  axiosInstance.get(nodeserverUrl + '/users/' + id,
    { headers: { Authorization: 'Bearer ' + token } }
  )
  .then(successCbk)
  .catch(errorCbk);
}

export const getGroup = (id, token, successCbk, errorCbk) => {
  axiosInstance.get(nodeserverUrl + '/groups/' + id,
    { headers: { Authorization: 'Bearer ' + token } }
  )
  .then(successCbk)
  .catch(errorCbk)
}

export const updateUser = (id, token, email, successCbk, errorCbk) => {
  axiosInstance.put(nodeserverUrl + '/users/' + id,
    {
      email: email,
      access_token: token
    }
  )
  .then(successCbk)
  .catch(errorCbk);
}

export const updateGroup = (id, token, members, successCbk, errorCbk) => {
  axiosInstance.put(nodeserverUrl + '/groups/' + id,
    {
      members: members,
      access_token: token
    }
  )
  .then(successCbk)
  .catch(errorCbk);
}

export const deleteUser  = (id, token, successCbk, errorCbk) => {
  axiosInstance.delete(nodeserverUrl + '/users/' + id,
    { headers: { Authorization: 'Bearer ' + token } }
  )
  .then(successCbk)
  .catch(errorCbk);
}
  