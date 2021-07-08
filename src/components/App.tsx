import React from "react";
import Init from "./Init";
import LoginTerminal from "./loginTerminal/LoginTerminal";
import MainView from "./main/MainView";
import ListOrders from "./listOrders/ListOrders";
import OrderView from "./order/OrderView";
import NewOrder from "./order/NewOrder";
import { connect, ConnectedProps } from "react-redux";
import Question from "./common/Question";
import { Preloader } from "./styledComponents/stilesComponents";
import { DT } from "../redux/dispatchTypes";

interface IApp extends PropsFromRedux {}

const App = (props: IApp) => {
  const preloader = props.preloader && <Preloader />;

  if (props.networkError) {
    return (
      <Question
        title={"Ошибка загрузки"}
        body="Повторить"
        callback={() => props.setNetworkError(false)}
        typeButton={"ok"}
      />
    );
  }
  if (props.terminalId === 0) {
    // нет терминала -> на авторизацию
    return <LoginTerminal />;
  }
  if (!props.initCompleted) {
    return (
      <>
        <Init />
        {preloader}
      </>
    );
  }

  let currentPage;
  switch (props.pageName) {
    case "loginTerminal":
      currentPage = <LoginTerminal />;
      break;
    case "main":
      currentPage = <MainView />;
      break;
    case "list":
      currentPage = <ListOrders />;
      break;
    case "admin":
      //    currentPage = <AdminView/>
      break;
    case "order":
      currentPage = <OrderView />;
      break;
    case "newOrder":
      currentPage = <NewOrder />;
      break;
    default:
      currentPage = <div>Error</div>;
      break;
  }
  return (
    <>
      {" "}
      {currentPage}
      {preloader}{" "}
    </>
  );
};

interface ImapState {
  navigation: {
    pageName: string;
  };
  appState: {
    terminalId: number;
    preloader: boolean;
    initCompleted: boolean;
    networkError: boolean;
  };
}

const mapState = (state: ImapState) => ({
  pageName: state.navigation.pageName,
  terminalId: state.appState.terminalId,
  preloader: state.appState.preloader,
  initCompleted: state.appState.initCompleted,
  networkError: state.appState.networkError,
});
const mapDispatch = {
  setNetworkError: (action: boolean) => ({
    type: DT.setNetworkError,
    networkError: action,
  }),
};

const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(App);
