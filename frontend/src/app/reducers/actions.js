/*
 * action types
 */
export const REQUEST_ARTICLES = "REQUEST_ARTICLES";
export const REQUEST_USERS = "REQUEST_USERS";
export const UPDATE_USER = "UPDATE_USER";
export const UPDATE_POSTS = "UPDATE_POSTS";
export const SEARCH_POSTS = "SEARCH_POSTS";
export const UPDATE_FOLLOWING = "UPDATE_FOLLOWING";
export const UPDATE_STATUS = "UPDATE_STATUS";
export const UPDATE_INFO = "UPDATE_INFO";
export const LOGIN = "LOGIN";
export const THIRD_PARTY = "THIRD_PARTY";
export const LOGOUT_USER = "LOGOUT_USER";


export function requestArticles(posts) {
    return {type: REQUEST_ARTICLES, posts}
}

export function requestUsers(users) {
    return {type: REQUEST_USERS, users}
}

export function updateUser(payload) {
    return {type: UPDATE_USER, payload}
}

export function searchPosts(req) {
    return {type: SEARCH_POSTS, req}
}

export function updatePosts(text) {
    return {type: UPDATE_POSTS, text}
}

export function updateFollowing(name) {
    return {type: UPDATE_FOLLOWING, name}
}

export function updateStatus(status) {
    return {type: UPDATE_STATUS, status}
}

export function updateInfo(info) {
    return {type: UPDATE_INFO, info}
}

export function login() {
    return {type: LOGIN}
}

export function thirdParty(auth) {
    return {type: THIRD_PARTY, auth}
}

export function logoutUser() {
    return {type: LOGOUT_USER}
}