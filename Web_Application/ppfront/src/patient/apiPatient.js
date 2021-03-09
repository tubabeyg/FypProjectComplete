export const read = (patientId, token) => {
    return fetch(`http://localhost:8080/patient/${patientId}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    }).then((response) => {
        console.log(response);
        return response.json();
    });
};

export const update = (patientId, token, patient) => {
    console.log("USER DATA FORM :", patient);
    return fetch(`http://localhost:8080/patient/${patientId}`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: patient,
    })
        .then((response) => {
            console.log(response);
            return response.json();
        })
        .catch((err) => console.log(err));
};

export const remove = (patientId, token) => {
    return fetch(`http://localhost:8080/patient/${patientId}`, {
        method: "DELETE",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    }).then((response) => {
        console.log(response);
        return response.json();
    });
};
export const list = () => {
    return fetch("http://localhost:8080/patients", {
        method: "GET",
    })
        .then((response) => {
            console.log("list", response);
            return response.json();
        })
        .catch((err) => console.log(err));
};

export const userapps = (id) => {
    return fetch(`http://localhost:8080/appointments/${id}`, {
        method: "GET",
    })
        .then((response) => {
            return response.json();
        })
        .catch((err) => console.log(err));
};

export const updatePatient = (patient, next) => {
    if (typeof window !== "undefined") {
        if (localStorage.getItem("jwt")) {
            let auth = JSON.parse(localStorage.getItem("jwt"));
            auth.patient = patient;
            localStorage.setItem("jwt", JSON.stringify(auth));
            next();
        }
    }
};
