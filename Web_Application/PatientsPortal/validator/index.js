//Appointment Validation
exports.createAppointmentValidator = (req, res, next) => {
    //title
    req.check("title", "write a title for appointment").notEmpty();
    req.check("title", "title must be 4 to 150 characters").isLength({
        min: 4,
        max: 150,
    });
    //body
    req.check("body", "write body for appointment").notEmpty();
    req.check("body", "body must be 4 to 2000 characters").isLength({
        min: 4,
        max: 2000,
    });

    //check for errors
    const errors = req.validationErrors();
    if (errors) {
        const firstError = errors.map((error) => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }

    next();
};
//SuperAdminn Validation
exports.superAdminSignUpValidation = (req, res, next) => {
    //name is not null and between 4-10 character
    req.check("Name", "Name is required").notEmpty();
    req.check("email", "Email is required").notEmpty();
    req.check("email")
        .matches(/.+\@.+\..+/)
        .withMessage("Email must contain @")
        .isLength({
            min: 4,
            max: 3000,
        });
    //check for password
    req.check("password", "Password is required").notEmpty();
    req.check("password")
        .isLength({ min: 6 })
        .withMessage("Password must contain atleast 6 character")
        .matches(/\d/)
        .withMessage("Password must contain a number");
    //check for errors
    const errors = req.validationErrors();
    if (errors) {
        const firstError = errors.map((error) => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }

    next();
};

//Patient Validation
exports.patientSignUpValidation = (req, res, next) => {
    //name is not null and between 4-10 character
    /*   req.check("firstname", "firstname is required").notEmpty();
  req.check("lastname", "lastname is required").notEmpty();
  req.check("email", "Email is required").notEmpty();
  req
    .check("email")
    .matches(/.+\@.+\..+/)
    .withMessage("Email must contain @")
    .isLength({
      min: 4,
      max: 3000,
    });
  //check for password
  req.check("password", "Password is required").notEmpty();
  req
    .check("password")
    .isLength({ min: 6 })
    .withMessage("Password must contain atleast 6 character")
    .matches(/\d/)
    .withMessage("Password must contain a number");
 */ //check for errors
    const errors = req.validationErrors();
    if (errors) {
        const firstError = errors.map((error) => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }

    next();
};

//Doctor Validation
exports.doctorSignUpValidation = (req, res, next) => {
    //name is not null and between 4-10 character
    req.check("firstname", "firstname is required").notEmpty();
    req.check("lastname", "lastname is required").notEmpty();
    req.check("email", "Email is required").notEmpty();
    req.check("email")
        .matches(/.+\@.+\..+/)
        .withMessage("Email must contain @")
        .isLength({
            min: 4,
            max: 3000,
        });
    //check for password
    req.check("password", "Password is required").notEmpty();
    req.check("password")
        .isLength({ min: 6 })
        .withMessage("Password must contain atleast 6 character")
        .matches(/\d/)
        .withMessage("Password must contain a number");
    //check for errors
    const errors = req.validationErrors();
    if (errors) {
        const firstError = errors.map((error) => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }

    next();
};

//Hospital Validation
exports.hospitalSignUpValidation = (req, res, next) => {
    //name is not null and between 4-10 character
    req.check("Name", "Name is required").notEmpty();
    //Pattern of email is satisfied
    req.check("email", "Email is required").notEmpty();
    req.check("email")
        .matches(/.+\@.+\..+/)
        .withMessage("Email must contain @")
        .isLength({
            min: 4,
            max: 3000,
        });
    //check for password
    req.check("password", "Password is required").notEmpty();
    req.check("password")
        .isLength({ min: 6 })
        .withMessage("Password must contain atleast 6 character")
        .matches(/\d/)
        .withMessage("Password must contain a number");
    //check for errors
    const errors = req.validationErrors();
    if (errors) {
        const firstError = errors.map((error) => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }

    next();
};
