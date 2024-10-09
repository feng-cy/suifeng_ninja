'use strict';

const got = require('got');
require('dotenv').config();
const { readFile } = require('fs/promises');
const path = require('path');

const qlDir = process.env.QL_DIR || '/ql';
const authFile = path.join(qlDir, 'config/auth.json');

const api = got.extend({
  prefixUrl: process.env.QL_URL || 'http://localhost:5600',
  retry: { limit: 0 },
});

// async function getToken() {
//   const authConfig = JSON.parse(await readFile(authFile));
//   return authConfig.token;
// }

async function getToken() {
  const body = await api({
      url: 'open/auth/token', searchParams: {
          client_id: process.env.client_id, 
          client_secret: process.env.client_secret,
      }
  }).json();
  if (body.code !== 200) {
      // throw new QLError("青龙令牌配置错误，请前往管理页面配置！", 500)
  }
  return body.data.token;
}

module.exports.getToken = async () => {
  const body = await api({
      url: 'open/auth/token', searchParams: {
          client_id: process.env.client_id, 
          client_secret: process.env.client_secret,
      }
  }).json();
  if (body.code !== 200) {
      // throw new QLError("青龙令牌配置错误，请前往管理页面配置！", 500)
  }
  return body.data.token;
}

module.exports.getEnvs = async () => {
  const token = await getToken();
  const body = await api({
    url: 'open/envs',
    searchParams: {
      searchValue: 'JD_COOKIE',
      t: Date.now(),
    },
    headers: {
      Accept: 'application/json',
      authorization: `Bearer ${token}`,
    },
  }).json();
  // console.log("getEnvs", body)
  return body.data;
};

module.exports.getEnvsCount = async () => {
  const data = await this.getEnvs();
  return data.length;
};

module.exports.addEnv = async (cookie, remarks) => {
  const token = await getToken();
  const body = await api({
    method: 'post',
    url: 'open/envs',
    params: { t: Date.now() },
    json: [{
      name: 'JD_COOKIE',
      value: cookie,
      remarks,
    }],
    headers: {
      Accept: 'application/json',
      authorization: `Bearer ${token}`,
      'Content-Type': 'application/json;charset=UTF-8',
    },
  }).json();
  // console.log("addEnv", body)
  return body;
};

module.exports.updateEnv = async (cookie, eid, remarks) => {
  const token = await getToken();
  const body = await api({
    method: 'put',
    url: 'open/envs',
    params: { t: Date.now() },
    json: {
      name: 'JD_COOKIE',
      value: cookie,
      id: eid,
      remarks,
    },
    headers: {
      Accept: 'application/json',
      authorization: `Bearer ${token}`,
      'Content-Type': 'application/json;charset=UTF-8',
    },
  }).json();
  return body;
};

module.exports.delEnv = async (eid) => {
  const token = await getToken();
  const body = await api({
    method: 'delete',
    url: 'open/envs',
    params: { t: Date.now() },
    body: JSON.stringify([eid]),
    headers: {
      Accept: 'application/json',
      authorization: `Bearer ${token}`,
      'Content-Type': 'application/json;charset=UTF-8',
    },
  }).json();
  return body;
};

//////////////////////////////////////////////////
// wskey
module.exports.getWSCKEnvs = async () => {
  const token = await getToken();
  const body = await api({
    url: 'open/envs',
    searchParams: {
      searchValue: 'JD_WSCK',
      t: Date.now(),
    },
    headers: {
      Accept: 'application/json',
      authorization: `Bearer ${token}`,
    },
  }).json();
  return body.data;
};

module.exports.getWSCKEnvsCount = async () => {
  const data = await this.getWSCKEnvs();
  return data.length;
};

module.exports.addWSCKEnv = async (jdwsck, remarks) => {
  const token = await getToken();
  const body = await api({
    method: 'post',
    url: 'open/envs',
    params: { t: Date.now() },
    json: [{
      name: 'JD_WSCK',
      value: jdwsck,
      remarks,
    }],
    headers: {
      Accept: 'application/json',
      authorization: `Bearer ${token}`,
      'Content-Type': 'application/json;charset=UTF-8',
    },
  }).json();
  return body;
};

module.exports.updateWSCKEnv = async (jdwsck, wseid, remarks) => {
  const token = await getToken();
  const body = await api({
    method: 'put',
    url: 'open/envs',
    params: { t: Date.now() },
    json: {
      name: 'JD_WSCK',
      value: jdwsck,
      _id: wseid,
      remarks,
    },
    headers: {
      Accept: 'application/json',
      authorization: `Bearer ${token}`,
      'Content-Type': 'application/json;charset=UTF-8',
    },
  }).json();
  return body;
};

module.exports.delWSCKEnv = async (wseid) => {
  const token = await getToken();
  const body = await api({
    method: 'delete',
    url: 'open/envs',
    params: { t: Date.now() },
    body: JSON.stringify([wseid]),
    headers: {
      Accept: 'application/json',
      authorization: `Bearer ${token}`,
      'Content-Type': 'application/json;charset=UTF-8',
    },
  }).json();
  return body;
};


module.exports.EnableCk = async (eid) => {
  const token = await getToken();
  const body = await api({
    method: 'put',
    url: 'open/envs/enable',
    params: { t: Date.now() },	
    body: JSON.stringify([eid]),
    headers: {
      Accept: 'application/json',
      authorization: `Bearer ${token}`,
      'Content-Type': 'application/json;charset=UTF-8',
    },
  }).json();
  return body;
};

//////////////////////////////////////////////////
