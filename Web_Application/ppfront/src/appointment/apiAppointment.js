export const create = (patientId, doctorId, token, appointment) => {
    return fetch(`http://localhost:8080/appointment/new/${patientId}/${doctorId}`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`
        },
        body: appointment

    })
        .then(response => {
            console.log(response)
            return response.json();
        })
        .catch(err => console.log(err))

}

export const list = () => {
    return fetch("http://localhost:8080/appointments", {
        method: "GET"
    })
        .then(response => {

            console.log("list", response);
            return response.json()

        })
        .catch(err => console.log(err));
}




export const singlePost = (appointmentId) => {
    return fetch(`http://localhost:8080/appointment/${appointmentId}`, {
        method: "GET"
    })
        .then(response => {

            console.log("appointment", response);
            return response.json()

        })
        .catch(err => console.log(err));
}


export const listByUser = (patientId, token) => {
    return fetch(`http://localhost:8080/appointment/by/${patientId}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    })
        .then(response => {

            console.log("appointments", response);
            return response.json();

        })
        .catch(err => console.log(err));
}

export const remove = (appointmentId, token) => {
    return fetch(`http://localhost:8080/appointment/${appointmentId}`, {
        method: "DELETE",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    })
        .then(response => {
            console.log(response)
            return response.json();
        })

}