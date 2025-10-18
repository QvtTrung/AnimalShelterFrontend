import { GitHubBanner, Refine, Authenticated } from "@refinedev/core";
import {
  useNotificationProvider,
  ThemedLayout,
  ErrorComponent,
  AuthPage,
  RefineThemes,
} from "@refinedev/antd";
import {
  GoogleOutlined,
  GithubOutlined,
  DashboardOutlined,
  HomeOutlined,
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
import { DashboardPage } from "../src/pages/dashboard";
import { RegisterPage } from "../src/pages/register";
import { authProvider } from "./providers/authProvider";

const App: React.FC = () => {
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
            ]}
            notificationProvider={useNotificationProvider}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
            }}
          >
            <Routes>
              <Route
                element={
                  <Authenticated
                    key="authenticated-routes"
                    fallback={<CatchAllNavigate to="/login" />}
                  >
                    <ThemedLayout>
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
                      title={false}
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
                <Route path="/register" element={<RegisterPage />} />
                <Route
                  path="/forgot-password"
                  element={<AuthPage type="forgotPassword" />}
                />
                <Route
                  path="/update-password"
                  element={<AuthPage type="updatePassword" />}
                />
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
