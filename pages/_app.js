import App from "next/app";
import React from "react";
import Router from "next/router";
import withReduxStore from "../lib/with-redux-store";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import Head from "next/head";
import { ThemeProvider } from "@material-ui/core/styles";
import LinearProgress from '@material-ui/core/LinearProgress';
import CssBaseline from "@material-ui/core/CssBaseline";
import theme from "../src/theme";
import Layout from "../components/layout";

function MyApp(props) {
  const { Component, pageProps, reduxStore } = props;
  const [loading, setLoading] = React.useState(false);

  const persistor = persistStore(reduxStore)

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
    const start = () => {
      setLoading(true);
    };
    const end = () => {
      setLoading(false);
    };
    Router.events.on("routeChangeStart", start);
    Router.events.on("routeChangeComplete", end);
    Router.events.on("routeChangeError", end);
    return () => {
      Router.events.off("routeChangeStart", start);
      Router.events.off("routeChangeComplete", end);
      Router.events.off("routeChangeError", end);
    };
  }, []);

  return (
    <Provider store={reduxStore}>
      <PersistGate
        loading={<Component {...pageProps} />}
        persistor={persistor}
      >
        <React.Fragment>
          <Head>
            <title>Yummy Pizza</title>
            <meta
              name="viewport"
              content="minimum-scale=1, initial-scale=1, width=device-width"
            />
          </Head>
          <ThemeProvider theme={theme}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            <Layout>
              { loading ? <LinearProgress/> : <Component {...pageProps} />}
            </Layout>
          </ThemeProvider>
        </React.Fragment>
      </PersistGate>
    </Provider>
  );
}

MyApp.getInitialProps = async (appContext) => {
  // calls page's `getInitialProps` and fills `appProps.pageProps`
  const appProps = await App.getInitialProps(appContext);

  return { ...appProps }
}

export default withReduxStore(MyApp);
