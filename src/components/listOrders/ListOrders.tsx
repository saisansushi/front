import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { connect, ConnectedProps } from "react-redux";
import {
  Footer,
  Header,
  Main,
  Preloader,
  StyledTableCell,
  StyledTableRow,
  Wrapper,
} from "../styledComponents/stilesComponents";
import { DT } from "../../redux/dispatchTypes";
import { orderAPI } from "../API";

interface IListOrder extends PropsFromRedux {}

const ListOrder = (props: IListOrder) => {
  const [load, setLoad] = useState(false);
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    props.resetOrder(); // сбросить данные предыдущего просмотра ордера
    // get orders from server

    orderAPI
      .getList(props.terminalId)
      .then((response) => {
        if (response.data.order) {
          setOrders(response.data.order);
          setLoad(true);
        } else {
          props.setNetworkError(true);
        }
      })
      .catch((error) => {
        console.log(error);
        setLoad(false);
        props.setNetworkError(true);
      });
  }, []);

  const tableHeaders = ["Заказ", "Дата", "Имя", "Телефон"];

  const OrderList = () => {
    const orderItem =
      load &&
      orders.map(
        (order: {
          customer: { firstname: string; telephone: string };
          dateAdded: string;
          orderId: number;
        }) => (
          <StyledTableRow
            key={order.orderId}
            onClick={() => {
              props.setCurrentOrder(order.orderId);
              props.changePage("order");
            }}
          >
            <StyledTableCell scope="row">{order.orderId}</StyledTableCell>
            <StyledTableCell>{order.dateAdded}</StyledTableCell>
            <StyledTableCell>{order.customer.firstname}</StyledTableCell>
            <StyledTableCell>{order.customer.telephone}</StyledTableCell>
          </StyledTableRow>
        )
      );
    return (
      <TableContainer style={{ maxHeight: "99%" }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {tableHeaders.map((item: string, index) => (
                <StyledTableCell key={index} align="left">
                  {item}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>{orderItem}</TableBody>
        </Table>
      </TableContainer>
    );
  };
  return (
    <Wrapper>
      <Header></Header>
      <Main>
        <Container style={{ overflow: "auto" }}>
          {load ? <OrderList /> : <Preloader />}
        </Container>
      </Main>
      <Footer>
        <Container>
          <Box m={1}>
            {" "}
            <Button
              variant="outlined"
              onClick={() => {
                props.changePage("newOrder");
              }}
            >
              Новый
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                props.changePage("main");
              }}
            >
              Назад
            </Button>
          </Box>
        </Container>
      </Footer>
    </Wrapper>
  );
};

interface ImapState {
  appState: {
    terminalId: number;
    networkError: boolean;
  };
}

const mapState = (state: ImapState) => ({
  terminalId: state.appState.terminalId,
  networkError: state.appState.networkError,
});

const mapDispatch = {
  setCurrentOrder: (orderId: number) => ({
    type: DT.currentOrder,
    openOrderId: orderId,
  }),
  changePage: (pageName: string) => ({ type: DT.setPage, pageName: pageName }),
  setNetworkError: (action: boolean) => ({
    type: DT.setNetworkError,
    networkError: action,
  }),
  resetOrder: () => ({ type: DT.resetOrder, content: null }),
};

const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(ListOrder);
