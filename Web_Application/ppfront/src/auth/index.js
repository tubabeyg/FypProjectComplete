/*-------superAdmin's api---------*/

export const superAdminsignup = (user) => {
    return fetch("http://localhost:8080/superAdminsignup", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-type": "application/json",
        },
        body: JSON.stringify(user),
    })
        .then((response) => {
            return response.json();
        })
        .catch((err) => console.log(err));
};

export const superAdminsignin = (user) => {
    return fetch("http://localhost:8080/superAdminsignin", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-type": "application/json",
        },
        body: JSON.stringify(user),
    })
        .then((response) => {
            return response.json();
        })
        .catch((err) => console.log(err));
};

export const superAdminsignout = (next) => {
    if (typeof window !== "undefined") {
        localStorage.removeItem("jwt");
    }
};

/*-------Hospital's api---------*/

export const hospitalsignup = (user) => {
    return fetch("http://localhost:8080/hospitalsignup", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-type": "application/json",
        },
        body: JSON.stringify(user),
    })
        .then((response) => {
            return response.json();
        })
        .catch((err) => console.log(err));
};

export const hospitalsignin = (user) => {
    return fetch("http://localhost:8080/hospitalsignin", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-type": "application/json",
        },
        body: JSON.stringify(user),
    })
        .then((response) => {
            return response.json();
        })
        .catch((err) => console.log(err));
};

export const hospitalsignout = (next) => {
    if (typeof window !== "undefined") {
        localStorage.removeItem("jwt");
    }
};

/*---- Doctor's Api----*/

export const doctorsignin = (user) => {
    return fetch("http://localhost:8080/doctorsignin", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-type": "application/json",
        },
        body: JSON.stringify(user),
    })
        .then((response) => {
            return response.json();
        })
        .catch((err) => console.log(err));
};

export const doctorsignout = (next) => {
    if (typeof window !== "undefined") {
        localStorage.clear();
    }
    return fetch("http://localhost:8080/signout", {
        method: "GET",
    })
        .then((response) => {
            console.log("signout", response);
            return response.json();
        })
        .catch((err) => console.log(err));
};

/*---- Patient's Api----*/

export const signup = (user) => {
    return fetch("http://localhost:8080/signup", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-type": "application/json",
        },
        body: JSON.stringify(user),
    })
        .then((response) => {
            return response.json();
        })
        .catch((err) => console.log(err));
};

export const signin = (user) => {
    return fetch("http://localhost:8080/signin", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-type": "application/json",
        },
        body: JSON.stringify(user),
    })
        .then((response) => {
            return response.json();
        })
        .catch((err) => console.log(err));
};

export const signout = (next) => {
    if (typeof window !== "undefined") {
        localStorage.removeItem("jwt");
    }
    next();
    return fetch("http://localhost:8080/signout", {
        method: "GET",
    })
        .then((response) => {
            console.log("signout", response);
            return response.json();
        })
        .catch((err) => console.log(err));
};

/*----- Authetication Functions------*/

export const authenticate = (jwt, next) => {
    if (typeof window !== "undefined") {
        localStorage.setItem("jwt", JSON.stringify(jwt));
        next();
    }
};

export const isAuthenticated = () => {
    if (typeof window == "undefined") {
        return false;
    } else if (localStorage.getItem("jwt")) {
        return JSON.parse(localStorage.getItem("jwt"));
    } else {
        return false;
    }
};
