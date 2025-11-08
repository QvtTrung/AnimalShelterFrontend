import { GitHubBanner, Refine, Authenticated } from "@refinedev/core";
import {
  useNotificationProvider,
  ErrorComponent,
  AuthPage,
  RefineThemes,
} from "@refinedev/antd";
import {
  GoogleOutlined,
  GithubOutlined,
  DashboardOutlined,
  HomeOutlined,
  UserOutlined,
  HeartOutlined,
  FileTextOutlined,
  SafetyOutlined,
} from "@ant-design/icons";

import { dataProvider } from "./providers/dataProvider";
import routerProvider, {
  NavigateToResource,
  CatchAllNavigate,
  UnsavedChangesNotifier,
  DocumentTitleHandler,
} from "@refinedev/react-router";
import { BrowserRouter, Routes, Route, Outlet } from "react-router";
import { App as AntdApp, ConfigProvider, Form, Input } from "antd";

import "@ant-design/v5-patch-for-react-19";
import "@refinedev/antd/dist/reset.css";
import "./index.css";

import { PetList, PetEdit, PetShow, PetCreate } from "../src/pages/pets";
import { UserList, UserEdit, UserShow, UserCreate } from "../src/pages/users";
import {
  AdoptionList,
  AdoptionEdit,
  AdoptionShow,
  AdoptionCreate,
} from "../src/pages/adoptions";
import {
  ReportList,
  ReportEdit,
  ReportShow,
  ReportCreate,
} from "../src/pages/reports";
import {
  RescueList,
  RescueEdit,
  RescueShow,
  RescueCreate,
} from "../src/pages/rescues";
import { DashboardPage } from "../src/pages/dashboard";
import { RegisterPage } from "../src/pages/register";
import { authProvider } from "./providers/authProvider";
import { ThemedHeader } from "./components/layout/header";
import { ThemedLayout } from "./components/layout";
import { ThemedSider } from "./components/layout/sider";
import { ThemedTitle } from "./components/layout/title";
import { useEffect } from "react";
import { initTokenManager } from "./utils/tokenManager";

const App: React.FC = () => {
  // Initialize token manager on app load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      initTokenManager();
    }
  }, []);

  return (
    <BrowserRouter>
      <ConfigProvider theme={RefineThemes.Blue}>
        <AntdApp>
          <Refine
            authProvider={authProvider}
            dataProvider={dataProvider}
            routerProvider={routerProvider}
            resources={[
              {
                name: "dashboard",
                list: "/",
                meta: {
                  label: "Dashboard",
                  icon: <DashboardOutlined />,
                },
              },
              {
                name: "pets",
                list: "/pets",
                create: "/pets/create",
                show: "/pets/show/:id",
                edit: "/pets/edit/:id",
                meta: {
                  label: "Pets",
                  icon: <HomeOutlined />,
                },
              },
              {
                name: "users",
                list: "/users",
                create: "/users/create",
                show: "/users/show/:id",
                edit: "/users/edit/:id",
                meta: {
                  label: "Users",
                  icon: <UserOutlined />,
                },
              },
              {
                name: "adoptions",
                list: "/adoptions",
                create: "/adoptions/create",
                show: "/adoptions/show/:id",
                edit: "/adoptions/edit/:id",
                meta: {
                  label: "Adoptions",
                  icon: <HeartOutlined />,
                },
              },
              {
                name: "reports",
                list: "/reports",
                create: "/reports/create",
                show: "/reports/show/:id",
                edit: "/reports/edit/:id",
                meta: {
                  label: "Reports",
                  icon: <FileTextOutlined />,
                },
              },
              {
                name: "rescues",
                list: "/rescues",
                create: "/rescues/create",
                show: "/rescues/show/:id",
                edit: "/rescues/edit/:id",
                meta: {
                  label: "Rescues",
                  icon: <SafetyOutlined />,
                },
              },
            ]}
            notificationProvider={useNotificationProvider}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
              disableServerSideValidation: true,
              title: {
                text: "Animal Shelter",
                icon: (
                  <img
                    src="/icon2.png"
                    alt="Logo"
                    className="w-[27px] h[27px]"
                  />
                ),
              },
            }}
          >
            <Routes>
              <Route
                element={
                  <Authenticated
                    key="authenticated-routes"
                    fallback={<CatchAllNavigate to="/login" />}
                  >
                    <ThemedLayout
                      Header={ThemedHeader}
                      Sider={ThemedSider}
                      Title={ThemedTitle}
                    >
                      <Outlet />
                    </ThemedLayout>
                  </Authenticated>
                }
              >
                <Route index element={<DashboardPage />} />
                <Route path="/pets">
                  <Route index element={<PetList />} />
                  <Route path="create" element={<PetCreate />} />
                  <Route path="edit/:id" element={<PetEdit />} />
                  <Route path="show/:id" element={<PetShow />} />
                </Route>
                <Route path="/users">
                  <Route index element={<UserList />} />
                  <Route path="create" element={<UserCreate />} />
                  <Route path="edit/:id" element={<UserEdit />} />
                  <Route path="show/:id" element={<UserShow />} />
                </Route>
                <Route path="/adoptions">
                  <Route index element={<AdoptionList />} />
                  <Route path="create" element={<AdoptionCreate />} />
                  <Route path="edit/:id" element={<AdoptionEdit />} />
                  <Route path="show/:id" element={<AdoptionShow />} />
                </Route>
                <Route path="/reports">
                  <Route index element={<ReportList />} />
                  <Route path="create" element={<ReportCreate />} />
                  <Route path="edit/:id" element={<ReportEdit />} />
                  <Route path="show/:id" element={<ReportShow />} />
                </Route>
                <Route path="/rescues">
                  <Route index element={<RescueList />} />
                  <Route path="create" element={<RescueCreate />} />
                  <Route path="edit/:id" element={<RescueEdit />} />
                  <Route path="show/:id" element={<RescueShow />} />
                </Route>
              </Route>

              <Route
                element={
                  <Authenticated key="auth-pages" fallback={<Outlet />}>
                    <NavigateToResource resource="pets" />
                  </Authenticated>
                }
              >
                <Route
                  path="/login"
                  element={
                    <AuthPage
                      type="login"
                      title={
                        <img
                          src="/logo2.png"
                          alt="Logo"
                          className="w-[320px] h-[75px]"
                        />
                      }
                      registerLink={false}
                      forgotPasswordLink={false}
                      // providers={[
                      //   {
                      //     name: "google",
                      //     label: "Sign in with Google",
                      //     icon: (
                      //       <GoogleOutlined
                      //         style={{
                      //           fontSize: 24,
                      //           lineHeight: 0,
                      //         }}
                      //       />
                      //     ),
                      //   },
                      //   {
                      //     name: "github",
                      //     label: "Sign in with GitHub",
                      //     icon: (
                      //       <GithubOutlined
                      //         style={{
                      //           fontSize: 24,
                      //           lineHeight: 0,
                      //         }}
                      //       />
                      //     ),
                      //   },
                      // ]}
                    />
                  }
                />
                {/* <Route path="/register" element={<RegisterPage />} />
                <Route
                  path="/forgot-password"
                  element={<AuthPage type="forgotPassword" />}
                />
                <Route
                  path="/update-password"
                  element={<AuthPage type="updatePassword" />}
                /> */}
              </Route>

              <Route
                element={
                  <Authenticated key="catch-all">
                    <ThemedLayout>
                      <Outlet />
                    </ThemedLayout>
                  </Authenticated>
                }
              >
                <Route path="*" element={<ErrorComponent />} />
              </Route>
            </Routes>
            <UnsavedChangesNotifier />
            <DocumentTitleHandler />
          </Refine>
        </AntdApp>
      </ConfigProvider>
    </BrowserRouter>
  );
};

export default App;
