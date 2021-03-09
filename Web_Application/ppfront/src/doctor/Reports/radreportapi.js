export const getradreportById = (radreportId, token) => {
    return fetch(`http://localhost:8080/radreport/${radreportId}`, {
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

export const deleteradreportById = (radreportId, token) => {
    return fetch(`http://localhost:8080/radreport/${radreportId}`, {
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

export const getAllradreports = () => {
    return fetch("http://localhost:8080/radreport/all", {
        method: "GET",
    })
        .then((response) => {
            console.log("list", response);
            return response.json();
        })
        .catch((err) => console.log(err));
};

export const getdoctorsnames = (doctors_ids, token) => {
    return fetch(`http://localhost:8080/doctor/getnamesdoctors`, {
        method: "POST",
        body: JSON.stringify({
            ids: doctors_ids,
        }),
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            // Authorization: `Bearer ${token}`,
        },
    }).then((response) => {
        console.log(response);
        return response.json();
    });
};

export const getpatientsnames = (patients_ids, token) => {
    return fetch(`http://localhost:8080/doctor/getnamespatients`, {
        method: "POST",
        body: JSON.stringify({
            ids: patients_ids,
        }),
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            // Authorization: `Bearer ${token}`,
        },
    }).then((response) => {
        console.log(response);
        return response.json();
    });
};

export const createradreport = (radreport, token) => {
    return fetch("http://localhost:8080/radreport/createpath", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-type": "application/json",
        },

        body: JSON.stringify(radreport),
    })
        .then((response) => {
            console.log("list", response);
            return response.json();
        })
        .catch((err) => console.log(err));
};

export const getUsersDropdown = () => {
    return fetch("http://localhost:8080/hospital/getallpatients").then(
        (response) => {
            console.log(response);
            return response.json();
        }
    );
};

export const getUsersDropdowndoctors = () => {
    return fetch(
        "http://localhost:8080/hospital/getalldoctors"
    ).then((response) => response.json());
};

export const getmessages = (body) => {
    return fetch(
        "http://localhost:8080/chat/conversation/query/" +
            body.sender +
            "/" +
            body.reciever
    ).then((response) => response.json());
};

export const getconversations = () => {
    return fetch("http://localhost:8080/chat/coversations").then((response) =>
        response.json()
    );
};

export const uploadFile = (file) => {
    return fetch("http:localhost:8000/chat/upload", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(file),
    })
        .then((response) => {
            console.log(response);
            return response.json();
        })
        .catch((err) => console.log(err));
};

export const sendmessage = (message) => {
    console.log(message, "lllll");
    return fetch("http://localhost:8080/chat/sendmessage", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
    })
        .then((response) => {
            console.log(response);
            return response.json();
        })
        .catch((err) => console.log(err));
};

export const getradreportsByDoctor = (token) => {
    const doctorId = localStorage.getItem("doctor_id");
    return fetch(
        `http://localhost:8080/radreport/radreports-by-doctor/${doctorId}`,
        {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        }
    ).then((response) => {
        console.log(response);
        return response.json();
    });
};

export const getradreportsOfPatient = (patientId, token) => {
    return fetch(
        `http://localhost:8080/radreport/radreports-of-patient/${patientId}`,
        {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        }
    ).then((response) => {
        console.log(response);
        return response.json();
    });
};
