import { SettingOutlined, UserOutlined } from "@ant-design/icons";
import { Layout, Menu } from "antd";
import "antd/dist/antd.css";
import React, { Component } from "react";
import {
    BrowserRouter as Router,
    Link,
    Route,
    Switch as RouterSwitch,
} from "react-router-dom";
import { superAdminsignout } from "../auth/index";
import CallEditHospital from "./CallEditHospital";
import DeleteHospital from "./DeleteHospital";
import displayHospital from "./displayHospital";
import RegisterHospital from "./RegisterHospital";
import styles from "./superadmindashboard.module.css";
import { superAdminDashboardContent } from "./superadmindashboardcontent";

const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;

class superAdmindashboard extends Component {
    constructor(props) {
        super(props);
        this.Signout = this.Signout.bind(this);
    }
    Signout() {
        superAdminsignout();
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
                            <Link className="text-blue">Admin's Portal</Link>
                        </div>
                        <Menu
                            theme="dark"
                            mode="inline"
                            style={{ minHeight: "500px" }}
                        >
                            <SubMenu
                                key="sub1"
                                icon={<UserOutlined />}
                                title="Hospitals"
                            >
                                <Menu.Item key="1">
                                    Register Hospital
                                    <Link to="/superAdmin/RegisterHospital" />
                                </Menu.Item>
                                <Menu.Item key="2">
                                    View Hospitals
                                    <Link to="/superAdmin/displayHospital" />
                                </Menu.Item>
                            </SubMenu>

                            <SubMenu
                                key="sub4"
                                icon={<SettingOutlined />}
                                title="Account"
                            >
                                <Menu.Item
                                    onClick={this.Signout}
                                    key="7"
                                    icon={<SettingOutlined />}
                                >
                                    Signout
                                </Menu.Item>
                            </SubMenu>
                        </Menu>
                    </Sider>

                    <Content className={styles.ss2}>
                        <RouterSwitch>
                            <Route
                                exact
                                path="/superAdmin/superAdmindashboard"
                            ></Route>
                            <Route
                                exact
                                path="/superAdmin/RegisterHospital"
                                component={RegisterHospital}
                            />
                            <Route
                                exact
                                path="/superAdmin/displayHospital"
                                component={displayHospital}
                            />
                            <Route
                                exact
                                path="/superAdmin/EditHospital/:id"
                                component={CallEditHospital}
                            />
                            <Route
                                exact
                                path="/superAdmin/superAdmindashboard"
                                component={superAdminDashboardContent}
                            />
                            <Route
                                exact
                                path="/superAdmin/DeleteHospital"
                                component={DeleteHospital}
                            />
                        </RouterSwitch>
                    </Content>
                </Router>
            </Layout>
        );
    }
}
export default superAdmindashboard;
