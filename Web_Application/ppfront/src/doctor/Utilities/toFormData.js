// Transforms key/value pairs to FormData() object
export const toFormData = (values = {}, method = "POST") => {
    const formData = new FormData();
    for (const field of Object.keys(values)) {
        formData.append(field, values[field]);
    }

    // NOTE: When working with Laravel PUT/PATCH requests and FormData
    // you SHOULD send POST request and fake the PUT request like this.
    // More info: http://stackoverflow.com/q/50691938
    if (method.toUpperCase() === "PUT") {
        formData.append("_method", "PUT");
    }

    return formData;
};
