export const getdoctor = (doctorId, token) => {
    return fetch(`http://localhost:8080/doctor/${doctorId}`, {
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

export const getdoctorappoint = (doctorId) => {
    return fetch(`http://localhost:8080/doctor/appointments/${doctorId}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    }).then((response) => {
        console.log(response);
        return response.json();
    });
};

export const acceptAppointment = (appId) => {
    return fetch(`http://localhost:8080/doctor/acceptAppointments/${appId}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    }).then((response) => {
        console.log(response);
        return response.json();
    });
};

export const updated = (doctorId, token, doctor) => {
    console.log("USER DATA FORM :", doctor);
    return fetch(`http://localhost:8080/doctor/${doctorId}`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: doctor,
    })
        .then((response) => {
            console.log(response);
            return response.json();
        })
        .catch((err) => console.log(err));
};
// export const upload = (messageId, token, message) => {
//     console.log("USER DATA FORM :", message);
//     return fetch(`http://localhost:8080/doctor/chat/${messageId}`, {
//         method: "PUT",
//         headers: {o
//             Accept: "application/jsn",
//             Authorization: `Bearer ${token}`,
//         },
//         body: message,
//     })
//         .then((response) => {
//             console.log(response);
//             return response.json();
//         })
//         .catch((err) => console.log(err));
// };

export const deletedoctor = (doctorId, token) => {
    return fetch(`http://localhost:8080/doctor/${doctorId}`, {
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
export const getalldoctors = () => {
    return fetch("http://localhost:8080/doctor/doctors", {
        method: "GET",
    })
        .then((response) => {
            console.log("list", response);
            return response.json();
        })
        .catch((err) => console.log(err));
};

export const updateDoctor = (patient, next) => {
    if (typeof window !== "undefined") {
        if (localStorage.getItem("jwt")) {
            let auth = JSON.parse(localStorage.getItem("jwt"));
            auth.patient = patient;
            localStorage.setItem("jwt", JSON.stringify(auth));
            next();
        }
    }
};
