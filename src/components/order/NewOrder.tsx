import { useRef, useState } from "react";
import Question from "../common/Question";
import { connect, ConnectedProps } from "react-redux";
import { DT } from "../../redux/dispatchTypes";
import InputPhone from "../common/NumberInput";
import GetName from "./GetName";
import GetVendor from "./GetVendor";
import { Preloader } from "../styledComponents/stilesComponents";
import axios from "axios";

// новый заказ
// запрашиваем откруда заказ
// запрашиваем телефон
// после получения номера ищем клиента в базе
//  если клиент есть в базе  ->  создаем новый заказ на сервере ->  открываем на экране заказа
// если новый клиент то запрос имени
// если клиент может быть из другого города (например телефон) то спрашивам из каого города
// создаем нового клиента
// создаем новый заказ на сервере -> открываем на экране заказа

interface INewOrder extends PropsFromRedux {}

const NewOrder = (props: INewOrder) => {
  const [questionSave, setQuestionSave] = useState(false);
  const [receptionStep, setReceptionStep] = useState("vendor");
  const [preloader, showPreloader] = useState(false);

  interface INewOrderData {
    vendorId?: number;
    locationVerified?: boolean;
    phone?: string;
    customerId?: number;
    name?: string;
  }

  const newOrderData = useRef<INewOrderData>({});

  const cbGetVendor = (
    vendorId: number | null,
    locationVerified: boolean = false
  ) => {
    if (vendorId) {
      // запрашиваем вендора переходим к запросу телефона
      newOrderData.current = {
        vendorId: vendorId,
        locationVerified: locationVerified,
      };
      setReceptionStep("phone");
    } else {
      setQuestionSave(true);
    }
  };
  const cbGetPhone = (phone: string | null) => {
    //запрашиваем телефон
    //отправляем для проверки на сервер
    if (phone) {
      newOrderData.current = { ...newOrderData.current, phone: phone };
      checkCustomer(phone);
    } else {
      setQuestionSave(true);
    }
  };

  const checkCustomer = (phone: string) => {
    showPreloader(true);
    // проверка номера телефона на сервере
    axios
      .post(
        props.apiURL + "customer/check_customer_by_phone/",
        {
          terminalId: props.terminalId,
          phone: phone,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Token-Authorization-X": props.token,
          },
        }
      )
      .then((response) => {
        showPreloader(false);
        let customerArr = response.data.customer;
        if (customerArr.customerId) {
          // пользователь есть в базе
          // забираем данные
          // откидываем на страницу оформления
          newOrderData.current = {
            ...newOrderData.current,
            customerId: customerArr.customerId,
          };
          createOrder();
        } else {
          // поьзователя нет в базе
          // спрашиваем имя
          setReceptionStep("name");
        }
      })
      .catch((error) => {
        console.log(error);
        showPreloader(false);
        props.setNetworkError(true);
      });
  };

  const cbGetName = (name: string | null) => {
    // спрашиваем имя
    if (name) {
      newOrderData.current = { ...newOrderData.current, name: name };

      // если локация нуждается в проверке то спрашиваем про город
      // если нет переходим к созданию заказа
      if (newOrderData.current.locationVerified) {
        createOrder();
      } else {
        setReceptionStep("city");
      }
    } else {
      setQuestionSave(true);
    }
  };

  const cbQuestionCity = (ourClient: boolean) => {
    // вопрос в каком регион находитесь
    if (ourClient) {
      createOrder();
    } else {
      exitOfOrder();
    }
  };

  const cbQuestionExit = (exit: boolean) => {
    if (exit) {
      exitOfOrder();
    } else {
      setQuestionSave(false);
    }
  };

  const exitOfOrder = () => {
    props.changePage("list");
  };

  const createOrder = () => {
    showPreloader(true);
    // создание заказа
    axios
      .post(
        props.apiURL + "order/create_order/",
        {
          terminalId: props.terminalId,
          newOrderData: newOrderData.current,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Token-Authorization-X": props.token,
          },
        }
      )
      .then((response) => {
        props.currentOrder(response.data.order.orderId);
        showPreloader(false);
        props.changePage("order");
      })
      .catch((error) => {
        console.error(error);
        showPreloader(false);
        props.setNetworkError(true);
      });
  };

  let view = null;
  switch (receptionStep) {
    case "vendor":
      view = <GetVendor cbGetVendor={cbGetVendor} />;
      break;
    case "phone":
      view = (
        <InputPhone
          cbNumberInput={cbGetPhone}
          maxLengthNumberInput={10}
          placeholder={"9000000000"}
          title={"Телефон"}
        />
      );
      break;
    case "name":
      view = <GetName cbGetName={cbGetName} />;
      break;
    case "city":
      view = (
        <Question
          title="Вопрос клиенту!"
          body="В каком населенном пункте вы находитесь?"
          callback={cbQuestionCity}
          footer={"Наш клиент?"}
          typeButton={"no-yes"}
        />
      );
      break;
  }

  if (questionSave) {
    view = (
      <Question
        title="Оформление не закончено!"
        body="Выйти?"
        callback={cbQuestionExit}
        typeButton={"yes-no"}
      />
    );
  } else if (preloader) {
    view = <Preloader />;
  }
  return <>{view}</>;
};

interface ImapState {
  config: {
    apiURL: string;
    token: string;
  };
  appState: {
    terminalId: number;
  };
}

const mapState = (state: ImapState) => ({
  apiURL: state.config.apiURL,
  terminalId: state.appState.terminalId,
  token: state.config.token,
});
const mapDispatch = {
  currentOrder: (orderId: number) => ({
    type: DT.currentOrder,
    openOrderId: orderId,
  }),
  changePage: (pageName: string) => ({ type: DT.setPage, pageName: pageName }),
  setNetworkError: (action: boolean) => ({
    type: DT.setNetworkError,
    networkError: action,
  }),
};
const connector = connect(mapState, mapDispatch)
type PropsFromRedux = ConnectedProps<typeof connector>
export default connector(NewOrder)

