require('es6-promise').polyfill();
require('isomorphic-fetch');

const url = path => `http://localhost:3000${path}`;

describe('Validate Article functionality', () => {
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

    it('should give me zero articles', (done) => {
        fetch(url('/articles'), {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'cookie': cookie },
        }).then(res => res.json()).then(res => {
            if (res.articles instanceof Array)
                expect(res.articles.length).toEqual(0);
            done();
        });
    });

    it('should add new article with successive article id, return list of articles with new article', (done) => {
        // add a new article
        // verify you get the articles back with new article
        // verify the id, author, content of the new article
        let post = { text: "My first message!" };
        fetch(url('/article'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'cookie': cookie },
            body: JSON.stringify(post)
        }).then(res => res.json()).then(res => {
            if (res.articles instanceof Array) {
                res.articles.forEach((item) => {
                    if (item.text === "My first message!") {
                        expect(item._id).toEqual(1);
                        expect(item.author).toEqual('testUser'); 
                        expect(item.text).toEqual("My first message!");
                    }
                })
            }
            done();
        })
    });
    
    it('should give me one article', (done) => {
        fetch(url('/articles'), {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'cookie': cookie },
        }).then(res => res.json()).then(res => {
            if (res.articles instanceof Array)
                expect(res.articles.length).toEqual(1);
            done();
        });
    });
    
    it('should return an article with a specified id', (done) => {
   
        //call GET /articles/id with the chosen id
        // validate that the correct article is returned
        //TODO test article expected id, author, post 
        fetch(url('/articles/1'), {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'cookie': cookie },
        }).then(res => res.json()).then(res => {
            if (res.articles instanceof Array) {
                expect(res.articles[0]._id).toEqual(1);
                expect(res.articles[0].author).toEqual('testUser'); 
                expect(res.articles[0].text).toEqual("My first message!");
            }
            done();
        }); 
    })
});