import React from "react";
import { isAuthenticated } from "../../auth/index";
import { getUsersDropdown } from "./pathreportapi";
import { createradeport } from "./radreportapi";

class RadReport extends React.Component {
    constructor() {
        super();
        this.state = {
            allPatients: [],
            doctor: "",
            patient: "",
            Indication: "",
            Comparison: "",
            Technique: "",
            Findings: "",
            Conclusion: "",
            error: "",
            redirectTo: false,
            loading: false,
        };
    }

    componentDidMount() {
        getUsersDropdown().then((res) => {
            this.setState({ allPatients: res.results });
            console.log(res);
        });
    }
    handleChange = (name) => (event) => {
        this.setState({ error: " " });
        this.setState({ [name]: event.target.value });
    };

    clickSubmit = (event) => {
        event.preventDefault();

        this.setState({ loading: true });
        const token = isAuthenticated().token;

        const {
            patient,
            Indication,
            Comparison,
            Technique,
            Findings,
            Conclusion,
        } = this.state;
        var radreport = {
            doctor: localStorage.getItem("doctor_id"),
            patient,
            Indication,
            Comparison,
            Technique,
            Findings,
            Conclusion,
        };
        createradeport(radreport, token).then((data) => {
            if (data.error) this.setState({ error: data.error });
            else {
                this.setState({
                    doctor: "",
                    patient: "",
                    Indication: "",
                    Comparison: "",
                    Technique: "",
                    Findings: "",
                    Conclusion: "",

                    open: true,
                });
            }
        });
    };
}

export default RadReport;
