require('es6-promise').polyfill();
require('isomorphic-fetch');

const url = path => `http://localhost:3000${path}`;

describe('Validate Profile functionality', () => {
    let cookie;
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

    it('should give me headline', (done) => {
        fetch(url('/headline'), {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'cookie': cookie },
        }).then(res => res.json()).then(res => {
            expect(res.username).toEqual('testUser');
            expect(res.headline).toEqual('This is my headline!');
            done();
        });
    });

    it('should update headline of loggedIn user', (done) => {
        // add a new article
        // verify you get the articles back with new article
        // verify the id, author, content of the new article
        let payload = { headline: "Happy" };
        fetch(url('/headline'), {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'cookie': cookie },
            body: JSON.stringify(payload)
        }).then(res => res.json()).then(res => {
            expect(res.username).toEqual('testUser');
            expect(res.headline).toEqual('Happy');
            done();
        })
    });
    
    it('should give me new headline', (done) => {
        fetch(url('/headline'), {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'cookie': cookie },
        }).then(res => res.json()).then(res => {
            expect(res.username).toEqual('testUser');
            expect(res.headline).toEqual('Happy');
            done();
        });
    });  
});