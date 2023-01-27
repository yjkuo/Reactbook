/*
 * Test suite for articles
 */
require('es6-promise').polyfill();
require('isomorphic-fetch');

const url = path => `http://localhost:3000${path}`;

describe('Validate Registration and Login functionality', () => {
    let cookie;
    it('register new user', (done) => {
        let regUser = {username: 'testUser', email: 'abc@rice.edu', dob:'2022-08-22', zipcode: '12345', password: '123'};
        fetch(url('/register'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(regUser)
        }).then(res => res.json()).then(res => {
            expect(res.username).toEqual('testUser');
            expect(res.result).toEqual('success');
            done();
        });
    });

    
    it('login user', (done) => {
        let loginUser = {username: 'testUser', password: '123'};
        fetch(url('/login'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginUser)
        }).then(res => {
            cookie = res.headers.get('set-cookie');
            return res.json()
        }).then(res => {
            expect(res.username).toEqual('testUser');
            expect(res.result).toEqual('success');
            done();
        });
    });

    it('logout user', (done) => {
        fetch(url('/logout'), {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'cookie': cookie }
        }).then(res => {
            expect(res.status).toBe(200);
            done();
        });
    });

});
