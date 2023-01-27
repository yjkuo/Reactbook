import { REQUEST_ARTICLES, UPDATE_USER, SEARCH_POSTS, UPDATE_POSTS, UPDATE_FOLLOWING, UPDATE_STATUS, UPDATE_INFO, LOGIN, THIRD_PARTY, LOGOUT_USER } from "./actions";

const initialState = {
    user: {},
    posts: [],
    allPosts: [],
    following: [],
    isAuthenticated: false,
    loginError: false,
    auth: false
};
function getInitialState() {
    const data = localStorage.getItem('APP_STATE');
    if(data) return JSON.parse(data);
    return initialState;
}


export function socialApp( state = getInitialState(), action) {
    switch (action.type) {
        case REQUEST_ARTICLES:
            return {...state, allPosts: action.posts, posts: action.posts};
        case UPDATE_USER:
            return {
                ...state,
                user: {...action.payload},
                isAuthenticated: true 
            }

        case SEARCH_POSTS:
            let req = action.req.toLowerCase();
            let posts = state.allPosts.filter(x => (x.text.toLowerCase().includes(req) || x.author.toLowerCase().includes(req)))
            return { ...state, posts: posts};

        case UPDATE_POSTS:
            let tmp = new Date();
            let curTime = tmp.getFullYear() + "-" + tmp.getMonth() + "-" + tmp.getDate();
            let post = {userId: state.user.id, 
                            id: 0, 
                            title:"", 
                            body: action.text.text, 
                            time: curTime, 
                            name: state.user.username,
                            img: false
                        };
            return { ...state, posts: [post, ...state.posts], allPosts: [post, ...state.allPosts] }

        case UPDATE_FOLLOWING:
            return { ...state, following: action.name};
            
        case UPDATE_STATUS:
            return { ...state, 
                user: {...state.user, headline: action.status}
            }
        case UPDATE_INFO:
            return { ...state, user: action.info}
        case LOGIN:
            return { ...state, loginError: true}
        case THIRD_PARTY:
            return { ...state, auth: action.auth}
        case LOGOUT_USER:
            let newState = { ...state, 
                user: {},
                posts: [],
                following: [],
                isAuthenticated: false,
                loginError: false,
                auth: false }; 
            localStorage.setItem('APP_STATE', JSON.stringify(newState));
            return newState;   
        default:
            return state;
    }
}
