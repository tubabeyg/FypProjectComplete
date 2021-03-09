/** Doctor's Actions **/
export const doctorsignup = (user, token) => {
    return fetch("http://localhost:8080/hospital/doctorsignup", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(user),
    })
        .then((response) => {
            return response.json();
        })
        .catch((err) => console.log(err));
};

export const getdoctors = (token) => {
    return fetch(`http://localhost:8080/hospital/getdoctors`, {
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
export const deleteDoctor = (doctorId, token) => {
    return fetch(`http://localhost:8080/hospital/deletedoctor`, {
        method: "DELETE",
        body: JSON.stringify({
            id: doctorId,
        }),
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
/** Patient's Actions **/
export const patientsignup = (user, token) => {
    return fetch("http://localhost:8080/hospital/patientsignup", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(user),
    })
        .then((response) => {
            return response.json();
        })
        .catch((err) => console.log(err));
};

export const getpatient = (token) => {
    return fetch(`http://localhost:8080/hospital/getpatients`, {
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
export const deletePatient = (patientId, token) => {
    return fetch(`http://localhost:8080/hospital/deletepatient`, {
        method: "DELETE",
        body: JSON.stringify({
            id: patientId,
        }),
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

export const updateHospital = (hospital, next) => {
    if (typeof window !== "undefined") {
        if (localStorage.getItem("jwt")) {
            let auth = JSON.parse(localStorage.getItem("jwt"));
            auth.hospital = hospital;
            localStorage.setItem("jwt", JSON.stringify(auth));
            next();
        }
    }
};
