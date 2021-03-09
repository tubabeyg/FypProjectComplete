import { SettingOutlined, UserOutlined } from "@ant-design/icons";
import { Layout, Menu } from "antd";
import "antd/dist/antd.css";
import SubMenu from "antd/lib/menu/SubMenu";
import React, { Component } from "react";
import {
    BrowserRouter as Router,
    Link,
    Route,
    Switch as RouterSwitch,
} from "react-router-dom";
import { hospitalsignout } from "../auth/index";
import DoctorDisplay from "./doctordisplay";
import DoctorSignup from "./doctorsignup";
import { HospitalDashboardContent } from "./hospiptaldashboard";
import "./hospital.css";
import styles from "./hospitaldashboard.module.css";
import PatientDisplay from "./patientdisplay";
import PatientSignup from "./PatientSignup";

const { Content, Sider } = Layout;

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.Signout = this.Signout.bind(this);
    }
    Signout() {
        hospitalsignout();
        this.props.history.push("/");
    }
    render() {
        return (
            <Layout>
                <Router>
                    <Sider
                        breakpoint="lg"
                        collapsedWidth="0"
                        onBreakpoint={(broken) => {
                            console.log(broken);
                        }}
                        onCollapse={(collapsed, type) => {
                            console.log(collapsed, type);
                        }}
                    >
                        <div
                            className={styles.logo}
                            style={{
                                color: "navy-blue",
                                marginBottom: 500,
                                height: 50,
                                background: "rgba(255, 255, 255, 0.2)",
                                margin: 16,
                                padding: 6,
                                textAlign: "center",
                            }}
                        >
                            <Link
                                className="text-blue"
                                to="/hospital/dashboard"
                            >
                                Hospital's Portal
                            </Link>
                        </div>

                        <Menu
                            theme="dark"
                            mode="inline"
                            style={{ minHeight: "500px" }}
                        >
                            <SubMenu
                                key="sub2"
                                icon={<UserOutlined />}
                                title="Doctors"
                            >
                                <Menu.Item key="2-3">
                                    Register doctors
                                    <Link to="/hospital/dashboard/signup" />
                                </Menu.Item>
                                <Menu.Item key="2-4">
                                    Registered Doctors
                                    <Link to="/hospital/dashboard/getdoctors" />
                                </Menu.Item>
                            </SubMenu>

                            <SubMenu
                                key="sub3"
                                icon={<UserOutlined />}
                                title="Patients"
                            >
                                <Menu.Item key="3-4">
                                    Register Patients
                                    <Link to="/hospital/dashboard/patientsignup" />
                                </Menu.Item>
                                <Menu.Item key="4-5">
                                    Display Patients
                                    <Link to="/hospital/dashboard/getpatients" />
                                </Menu.Item>
                            </SubMenu>
                            <SubMenu
                                key="sub4"
                                icon={<SettingOutlined />}
                                title="Account"
                            >
                                <Menu.Item
                                    onClick={this.Signout}
                                    key="9"
                                    icon={<SettingOutlined />}
                                >
                                    Signout
                                </Menu.Item>
                            </SubMenu>
                        </Menu>
                    </Sider>

                    <Content className={styles.ssl}>
                        <RouterSwitch>
                            <Route
                                exact
                                path="/hospital/dashboard"
                                component={HospitalDashboardContent}
                            />

                            <Route
                                exact
                                path="/hospital/dashboard/signup"
                                component={DoctorSignup}
                            />
                            <Route
                                exact
                                path="/hospital/dashboard/getdoctors"
                                component={DoctorDisplay}
                            />
                            <Route
                                exact
                                path="/hospital/dashboard/patientsignup"
                                component={PatientSignup}
                            />
                            <Route
                                exact
                                path="/hospital/dashboard/getpatients"
                                component={PatientDisplay}
                            />
                        </RouterSwitch>
                    </Content>
                </Router>
            </Layout>
        );
    }
}

export default Dashboard;
