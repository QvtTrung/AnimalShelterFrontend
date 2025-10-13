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
} from "@ant-design/icons";

import dataProvider from "@refinedev/simple-rest";
import routerProvider, {
  NavigateToResource,
  CatchAllNavigate,
  UnsavedChangesNotifier,
  DocumentTitleHandler,
} from "@refinedev/react-router";
import { BrowserRouter, Routes, Route, Outlet } from "react-router";
import { App as AntdApp, ConfigProvider } from "antd";

import "@ant-design/v5-patch-for-react-19";
import "@refinedev/antd/dist/reset.css";

import { PostList, PostEdit, PostShow } from "../src/pages/posts";
import { DashboardPage } from "../src/pages/dashboard";
import { authProvider } from "./providers/authProvider";

const API_URL = "http://localhost:3000/api";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ConfigProvider theme={RefineThemes.Blue}>
        <AntdApp>
          <Refine
            authProvider={authProvider}
            dataProvider={dataProvider(API_URL)}
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
                name: "posts",
                list: "/posts",
                show: "/posts/show/:id",
                edit: "/posts/edit/:id",
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

                <Route path="/posts">
                  <Route index element={<PostList />} />
                  <Route path="edit/:id" element={<PostEdit />} />
                  <Route path="show/:id" element={<PostShow />} />
                </Route>
              </Route>

              <Route
                element={
                  <Authenticated key="auth-pages" fallback={<Outlet />}>
                    <NavigateToResource resource="posts" />
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
                <Route
                  path="/register"
                  element={
                    <AuthPage
                      type="register"
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
