import { socialApp } from '../reducers';
import { updateUser, requestArticles, requestUsers, logoutUser, searchPosts, updateFollowing, deleteFollowing, updateInfo, updateStatus, updatePosts } from '../actions';

const initialState = {
    user: {id: -1, username: "", status: "" },
    posts: [],
    allPosts: [],
    users: [],
    following: [],
    isAuthenticated: false,
    userInfo: {phone: "123-123-1234", email: "abc@gmail.com", zip: "77005", password: "123"}
};


describe('Validate Authentication', () => {
    it('should log in a previously registered user', async () => {
        let res = await fetch("https://jsonplaceholder.typicode.com/users")
        res = await res.json();
        
        let newState = socialApp(undefined, requestUsers(res));
        newState = socialApp(newState, updateUser({id: 1, auth: true}));
        expect(newState).toMatchObject({
            user: {id: 1, username: "Bret", status: "Multi-layered client-server neural-net"},
            isAuthenticated: true });
            
    });
    

    it('should not log in an invalid user', () => {
        let newState = socialApp(undefined, updateUser({username: "Unknown User", password: "UNKNOWN"}));
        expect(newState.loginError).toBeTruthy();
    });

    it('should log out a user', async () => {
        let res = await fetch("https://jsonplaceholder.typicode.com/users")
        res = await res.json();
        
        let newState = socialApp(undefined, requestUsers(res));
        newState = socialApp(newState, updateUser({id: 1, auth: true}));
        newState = socialApp(newState, logoutUser());
        expect(newState.isAuthenticated).toBeFalsy();
        
    });

})

describe('Validate Article actions', () => {
    let newState = null;
    beforeAll(async () => {
        let res = await fetch("https://jsonplaceholder.typicode.com/posts");
        let users = await fetch("https://jsonplaceholder.typicode.com/users");
        res = await res.json();
        users = await users.json();
        newState = socialApp(undefined, requestUsers(users));
        newState = socialApp(newState, requestArticles(res));
        newState = socialApp(newState, updateUser({id: 1, auth: true}));

    })

    it('should fetch all articles for current logged in user', () => {
        expect(newState.allPosts.length).toEqual(100);
    });

    it('should fetch subset of articles for current logged in user given search keyword', async () => {
        
        const beforePosts = newState.posts.length;
        newState = socialApp(newState, searchPosts("Antonette"));
        expect(newState.posts.length).toBeLessThan(beforePosts);
    });

    it('should add articles when adding a follower', async () => {
        const beforeFollow = newState.posts.length;
        newState = socialApp(newState, updateFollowing("Kamren"));
        expect(newState.posts.length).toBeGreaterThan(beforeFollow);
        
    });

    it('should remove articles when removing a follower', async () => {
        
        const beforeUnfollow = newState.posts.length;
        newState = socialApp(newState, deleteFollowing(2));
        expect(newState.posts.length).toBeLessThan(beforeUnfollow);
    });

    it('should add articles to feed', async () => {
        const before = newState.posts.length;
        newState = socialApp(newState, updatePosts("New article"));
        expect(newState.posts.length).toBeGreaterThan(before);
    });
})

describe('Validate Profile actions', () => {
    it('should fetch the logged in user\'s profile username', async () => {
        let res = await fetch("https://jsonplaceholder.typicode.com/users")
        res = await res.json();
        
        let newState = socialApp(undefined, requestUsers(res));
        newState = socialApp(newState, updateUser({id: 1, auth: true}));
        expect(newState.user.username).toEqual("Bret");
    });

    it('should update user\'s profile info', () => {
        let newInfo = {username: "John", 
                    email: "ab12@rice.edu", 
                    phone: "111-222-3333", 
                    password:"abc123", 
                    zip: "77777"};
        let newState = socialApp(undefined, updateInfo(newInfo));
        
        expect(newState.userInfo).toEqual(newInfo);
    });

    it('should update user\'s headline', () => {
        let newStatus = "New Status"
        let newState = socialApp(undefined, updateStatus(newStatus));
        expect(newState.user.status).toEqual(newStatus);
    });
})
