import React, { useState, useEffect } from "react";
import axios from "axios";
import { connect, ConnectedProps } from "react-redux";
import Question from "../common/Question";
import CustomerFragment from "./CustomerFragment";
import ProductsFragment from "./ProductsFragment";
import MenuProducts from "./MenuProducts";
import {
  Wrapper,
  Main,
  Header,
  Footer,
  Preloader,
} from "../styledComponents/stilesComponents";
import { Grid, Button, Container } from "@material-ui/core";

import { DT } from "../../redux/dispatchTypes";
import EditAddress from "./EditAddress";

/**
 * список заказов
 */

interface IOrderView extends PropsFromRedux {}

const OrderView = (props: IOrderView) => {
  const [initLoad, setInitLoad] = useState(false);
  const [preloader, showPreloader] = useState(false);
  const [locked, setLocked] = useState(false);
  const [questionSave, setQuestionSave] = useState(false);

  const exitOfOrder = () => {
    if (props.order.modified) {
      // если модифицирован то   спрашиваем сохранить ?
      setQuestionSave(true);
    } else {
      props.changeMenuMode(false);
      unlockAndExit();
    }
  };
  const cbQuestionExit = (save: boolean) => {
    setQuestionSave(false);
    if (save) {
      saveOrder().then(() => unlockAndExit());
    } else {
      // выход без сохранения заказа
      unlockAndExit();
    }
  };

  const unlockAndExit = () => {
    unlockOrder().then(() => props.changePage("list"));
  };

  const unlockOrder = () => {
    showPreloader(true);
    const request = axios.post(
      props.apiURL + "order/unlock_order/",
      {
        terminalId: props.terminalId,
        orderId: props.openOrderId,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Token-Authorization-X": props.token,
        },
      }
    );
    request
      .then((response) => {
        showPreloader(false);
      })
      .catch((error) => {
        console.log(error);
        showPreloader(false);
        props.setNetworkError(true);
      });
    return request;
  };

  const saveOrder = () => {
    showPreloader(true);
    const request = axios.post(
      props.apiURL + "order/save_order/",
      {
        terminalId: props.terminalId,
        orderId: props.openOrderId,
        orderData: props.order,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Token-Authorization-X": props.token,
        },
      }
    );
    request
      .then((response) => {
        props.orderSetContent({ modified: false });
        showPreloader(false);
      })
      .catch((error) => {
        console.log(error);
        showPreloader(false);
        props.setNetworkError(true);
      });
    return request;
  };

  useEffect(() => {
    // загружаемые адреса каждый раз проверяются на вхождение в полигон, он мог измениться. Надо сделать марикорвку нормальных адресов и не нормальных
    axios
      .post(
        props.apiURL + "order/get_order/",
        {
          terminalId: props.terminalId,
          orderId: props.openOrderId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Token-Authorization-X": props.token,
          },
        }
      )
      .then((response) => {
        let order = response.data.order[0];
        props.orderSetContent(order);
        // проверяем блокировку
        if (order.locked === 0 || order.locked === props.terminalId) {
          // не блокирован// или блок соотвествует терминалу// блок ставится сам на сервере
          setLocked(false);
        } else {
          setLocked(true);
        }
        setInitLoad(true);
      })
      .catch((error) => {
        console.log(error);
        setInitLoad(false);
        setLocked(false);
        props.setNetworkError(true);
      });
  }, []);

  let question = undefined;
  if (locked) {
    question = (
      <Question
        title={"Заказ заблокирован терминалом - " + props.order.locked}
        body="Закрыть заказ"
        callback={() => props.changePage("list")}
        typeButton={"ok"}
      />
    ); // на заблокированном заказе выходим без проверки на изменение
  } else if (questionSave)
    question = questionSave && (
      <Question
        title="Заказ НЕ сохранен!"
        body="Сохранить?"
        callback={cbQuestionExit}
        typeButton={"no-yes"}
      />
    );

  const address = props.navigation.addressMode !== "none" && <EditAddress />;

  const btnMenu = (props.navigation.menuMode && (
    <Button
      variant="outlined"
      style={{ margin: "1px" }}
      onClick={() => {
        props.changeMenuMode(false);
      }}
    >
      Закрыть меню{" "}
    </Button>
  )) || (
    <Button
      variant="outlined"
      style={{ margin: "1px" }}
      onClick={() => {
        props.changeMenuMode(true);
      }}
    >
      Меню{" "}
    </Button>
  );
  const leftPanel = (props.navigation.menuMode && <MenuProducts />) || (
    <CustomerFragment />
  );
  const preLoader = (preloader || !initLoad) && <Preloader />;
  const view = initLoad && (
    <Wrapper>
      <Header>
        Заказ № {props.openOrderId} {props.order.modified ? "*" : ""}
      </Header>
      <Main row>
        <Container>
          <Grid container spacing={3} style={{ height: "100%" }}>
            <Grid item xs={5} style={{ maxHeight: "100%" }}>
              {leftPanel}
            </Grid>

            <Grid
              item
              xs={7}
              style={{
                maxHeight: "100%",
                overflowY: "scroll",
                display: "flex",
              }}
            >
              <ProductsFragment />
            </Grid>
          </Grid>
        </Container>
      </Main>
      <Footer>
        {btnMenu}
        <Button
          variant="outlined"
          style={{ margin: "1px" }}
          onClick={() => {
            saveOrder().then();
          }}
        >
          Сохранить{" "}
        </Button>
        <Button
          variant="outlined"
          style={{ margin: "1px" }}
          onClick={() => {
            exitOfOrder();
          }}
        >
          Выход{" "}
        </Button>
      </Footer>
    </Wrapper>
  );

  return (
    <>
      {" "}
      {view} {preLoader} {question} {address}{" "}
    </>
  );
};

interface ImapState {
  config: {
    apiURL: string;
    token: string;
  };
  appState: {
    terminalId: number;
    networkError: boolean;
    openOrderId: number;
  };
  navigation: {
    menuMode: boolean;
    addressMode: string;
  };
  order: {
    orderData: {
      modified: boolean;
      locked: boolean;
    };
  };
}

const mapState = (state: ImapState) => ({
  navigation: state.navigation,
  apiURL: state.config.apiURL,
  terminalId: state.appState.terminalId,
  token: state.config.token,
  openOrderId: state.appState.openOrderId,
  order: state.order.orderData,
});

const mapDispatch = {
  orderSetContent: (content: object) => ({
    type: DT.orderSetContent,
    content: content,
  }),
  setCurrentOrder: () => ({ type: DT.currentOrder, openOrderId: null }),
  changePage: (pageName: string) => ({ type: DT.setPage, pageName: pageName }),
  changeMenuMode: (menuMode: boolean) => ({
    type: DT.setMenuMode,
    menuMode: menuMode,
  }),
  setNetworkError: (action: boolean) => ({
    type: DT.setNetworkError,
    networkError: action,
  }),
};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(OrderView);
