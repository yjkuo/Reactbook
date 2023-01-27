
// const url = path => `https://yk66-final-backend.herokuapp.com${path}`;
const url = path => `http://localhost:3001${path}`;
let cookie;
const register = async (reqUser) => {
    return await fetch(url('/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reqUser),
        credentials: 'include'
    });
};

const login = async (reqUser) => {
    return await fetch(url('/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reqUser),
        credentials: 'include'
    }).then(res => {
        cookie = res.headers.get('set-cookie');
        return res;
    })
};

const thirdPartyLogin = async () => {
    return await fetch(url('/auth/login'), {
        method: 'GET',
        credentials: 'include'
    }).then(res => {
        // cookie = res.headers.get('set-cookie');
        return res;
    })
}
const linkAccount = async () => {
    return await fetch(url('/link'), {
        method: 'GET',
        credentials: 'include'
    });
}
const unlinkAccount = async () => {
    return await fetch(url('/unlink'), {
        method: 'GET',
        credentials: 'include'
    });
}
const getProfile = async () => {
    return await fetch(url('/profile'), {
        method: 'GET',
        // headers: { 'cookie': cookie },
        credentials: 'include'
    }).then(res => {
        return res.json();
    });
}

const getArticles = async () => {
    return await fetch(url('/articles'), {
        method: 'GET',
        headers: { 'cookie': cookie },
        credentials: 'include'
    }).then(res => res.json()).then(res => {
        return res.articles;
    });
}

const getFollowing = async () => {
    return await fetch(url('/followprofile'), {
        method: 'GET',
        headers: { 'cookie': cookie },
        credentials: 'include'
    }).then(res => res.json()).then(res => {
        return res.following;
    });
}

const deleteFollowing = async (user) => {
    return await fetch(url('/following/' + user), {
        method: 'DELETE',
        headers: { 'cookie': cookie },
        credentials: 'include'
    }).then(res => {
        return getFollowing();
    });
}

const addFollowing = async (user) => {
    return await fetch(url('/following/' + user), {
        method: 'PUT',
        headers: { 'cookie': cookie },
        credentials: 'include'
    });
}

const updateAvatar = async (payload) => {
    return await fetch(url('/avatar'), {
        method: 'PUT',
        headers: { 'cookie': cookie },
        credentials: 'include',
        body: payload
    }).then(res => {
        return res.json();
    });
}

const updateHeadline = async (payload) => {
    return await fetch(url('/headline'), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'cookie': cookie },
        credentials: 'include',
        body: JSON.stringify(payload)
    }).then(res => {
        return res.json();
    });
}
const addArticle = async (payload) => {
    return await fetch(url('/article'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'cookie': cookie },
        credentials: 'include',
        body: JSON.stringify(payload)
    }).then(res => res.json()).then(res => {
        return res.articles;
    });
}

const postArticle = async (payload) => {
    return await fetch(url('/post'), {
        method: 'POST',
        headers: { 'cookie': cookie },
        credentials: 'include',
        body: payload
    }).then(res => res.json()).then(res => {
        return res.articles;
    });
}

const updateArticle = async (id, payload) => {
    return await fetch(url('/articles/' + id), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'cookie': cookie },
        credentials: 'include',
        body: JSON.stringify(payload)
    }).then(res => res.json()).then(res => {
        return res.articles;
    });
}

const updateZipcode = async (zipcode) => {
    return await fetch(url('/zipcode'), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'cookie': cookie },
        credentials: 'include',
        body: JSON.stringify({zipcode: zipcode})
    });
}
const updateEmail = async (email) => {
    return await fetch(url('/email'), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'cookie': cookie },
        credentials: 'include',
        body: JSON.stringify({email: email})
    });
}
const updatePhone = async (phone) => {
    return await fetch(url('/phone'), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'cookie': cookie },
        credentials: 'include',
        body: JSON.stringify({phone: phone})
    });
}
const updatePassword = async (password) => {
    return await fetch(url('/password'), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'cookie': cookie },
        credentials: 'include',
        body: JSON.stringify({password: password})
    });
}
const logout = async () => {
    return await fetch(url('/logout'), {
        method: 'PUT',
        headers: { 'cookie': cookie },
        credentials: 'include',
    });
}
export { register, thirdPartyLogin, linkAccount, unlinkAccount, login, logout, getArticles, getFollowing, getProfile, updateAvatar, updateHeadline, updateArticle, addArticle, postArticle, deleteFollowing, addFollowing, updateEmail, updatePassword, updateZipcode, updatePhone }