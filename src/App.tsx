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
  BellOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

import { dataProvider } from "./providers/dataProvider";
import routerProvider, {
  NavigateToResource,
  CatchAllNavigate,
  UnsavedChangesNotifier,
  DocumentTitleHandler,
} from "@refinedev/react-router";
import { BrowserRouter, Routes, Route, Outlet } from "react-router";
import { App as AntdApp, ConfigProvider, Form, Input, theme } from "antd";

import "@ant-design/v5-patch-for-react-19";
import "@refinedev/antd/dist/reset.css";
import "./index.css";
import { LoginPage } from "./pages/login";

import { PetList, PetEdit, PetShow, PetCreate } from "../src/pages/pets";
import { UserList, UserEdit, UserShow, UserCreate } from "../src/pages/users";
import {
  AdoptionList,
  AdoptionEdit,
  AdoptionShow,
  AdoptionCreate,
  AdoptionConfirm,
  AdoptionCancel,
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
import { NotificationList, NotificationShow } from "../src/pages/notifications";
import { ActivityList, ActivityShow } from "../src/pages/activities";
import { ProfilePage } from "../src/pages/profile";
import { DashboardPage } from "../src/pages/dashboard";
import { RegisterPage } from "../src/pages/register";
import { authProvider } from "./providers/authProvider";
import { ThemedHeader } from "./components/layout/header";
import { ThemedLayout } from "./components/layout";
import { ThemedSider } from "./components/layout/sider";
import { ThemedTitle } from "./components/layout/title";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import { useEffect } from "react";
import { initTokenManager } from "./utils/tokenManager";

const AppContent: React.FC = () => {
  const { isDarkMode } = useTheme();
  // Initialize token manager on app load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      initTokenManager();
    }
  }, []);

  // Update data-theme attribute for CSS
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }, [isDarkMode]);

  return (
    <BrowserRouter>
      <ConfigProvider
        theme={{
          ...RefineThemes.Blue,
          algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        }}
      >
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
                  label: "Bảng điều khiển",
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
                  label: "Thú cưng",
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
                  label: "Người dùng",
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
                  label: "Nhận nuôi",
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
                  label: "Báo cáo",
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
                  label: "Cứu hộ",
                  icon: <SafetyOutlined />,
                },
              },
              {
                name: "notifications",
                list: "/notifications",
                show: "/notifications/show/:id",
                meta: {
                  label: "Thông báo",
                  icon: <BellOutlined />,
                },
              },
              {
                name: "activities",
                list: "/activities",
                show: "/activities/show/:id",
                meta: {
                  label: "Hoạt động",
                  icon: <ClockCircleOutlined />,
                },
              },
            ]}
            notificationProvider={useNotificationProvider}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
              disableServerSideValidation: true,
              title: {
                text: "Second chance sanctuary",
                icon: (
                  <img
                    src="/icon2.png"
                    alt="Logo"
                    className="w-[30px] h[30px]"
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
                <Route path="/notifications">
                  <Route index element={<NotificationList />} />
                  <Route path="show/:id" element={<NotificationShow />} />
                </Route>
                <Route path="/activities">
                  <Route index element={<ActivityList />} />
                  <Route path="show/:id" element={<ActivityShow />} />
                </Route>
                <Route path="/profile" element={<ProfilePage />} />
              </Route>

              <Route
                element={
                  <Authenticated key="auth-pages" fallback={<Outlet />}>
                    <NavigateToResource resource="pets" />
                  </Authenticated>
                }
              >
                <Route path="/login" element={<LoginPage />} />
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

              {/* Public routes for adoption confirmation/cancellation */}
              <Route path="/adoptions">
                <Route path="confirm/:id" element={<AdoptionConfirm />} />
                <Route path="cancel/:id" element={<AdoptionCancel />} />
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

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;
