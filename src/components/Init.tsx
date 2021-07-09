import { useEffect } from "react";
import { initAPI } from "./API";
import { connect, ConnectedProps } from "react-redux";
import { DT } from "../redux/dispatchTypes";
import { Preloader } from "./styledComponents/stilesComponents";

interface IInit extends PropsFromRedux {}

const Init = (props: IInit) => {
  useEffect(() => {
    initAPI.init()
      .then((response) => {
        if (response.data.init) {
          props.setInitProducts(response.data.init[0].products);
          props.setInitVendors(response.data.init[0].vendors);
          props.initCompleted(true);
        } else {
          props.setNetworkError(true);
        }
      })
      .catch((error) => {
        console.log(error);
        props.setNetworkError(true);
      });
  }, []);
  return (
    <>
      {" "}
      <Preloader />
    </>
  );
};


const mapDispatch = {
  changePage: (pageName: string) => ({ type: DT.setPage, pageName: pageName }),
  initCompleted: (Completed: boolean) => ({
    type: DT.initCompleted,
    initCompleted: Completed,
  }),
  setInitVendors: (content: {}) => ({
    type: DT.setInitVendors,
    content: content,
  }),
  setInitProducts: (content: {}) => ({
    type: DT.setInitProducts,
    content: content,
  }),
  setNetworkError: (action: boolean) => ({
    type: DT.setNetworkError,
    networkError: action,
  }),
};
const connector = connect(null, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(Init)