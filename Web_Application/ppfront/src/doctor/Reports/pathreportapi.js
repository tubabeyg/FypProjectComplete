export const getpathReportById = (pathreportId, token) => {
    return fetch(`http://localhost:8080/pathreport/${pathreportId}`, {
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

export const deletepathReportById = (pathreportId, token) => {
    return fetch(`http://localhost:8080/pathreport/${pathreportId}`, {
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
export const getAllpathReports = () => {
    return fetch("http://localhost:8080/pathreport/all", {
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

export const createpathReport = (pathreport, token) => {
    return fetch("http://localhost:8080/pathreport/createpath", {
        method: "POST",
        headers: {
            Accept: "application/json",
        },

        body: pathreport,
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

export const getpathReportsByDoctor = (token) => {
    const doctorId = localStorage.getItem("doctor_id");
    return fetch(
        `http://localhost:8080/pathreport/pathreports-by-doctor/${doctorId}`,
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

export const getpathReportsOfPatient = (patientId) => {
    return fetch(
        `http://localhost:8080/pathreport/pathreports-of-patient/${patientId}`,
        {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                // Authorization: `Bearer ${token}`,
            },
        }
    ).then((response) => {
        console.log(response);
        return response.json();
    });
};

export const getPathReportsOfPatientByDoctor = (
    patientId,
    fromDate,
    toDate,
    doctorId = null,
    token = null
) => {
    if (!doctorId) {
        doctorId = localStorage.getItem("doctor_id");
    }
    return fetch(
        `http://localhost:8080/pathreport/pathreports-of-patient-by-doctor/${patientId}/${doctorId}`,
        {
            method: "POST",
            body: JSON.stringify({
                patientId,
                fromDate,
                toDate,
                doctorId,
            }),

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
