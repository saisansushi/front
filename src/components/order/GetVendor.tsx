import { connect, ConnectedProps } from "react-redux";
import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";

interface IGetVendor extends PropsFromRedux {
  cbGetVendor: (vendorId: number | null, locationVerified: boolean) => void;
}

const GetVendor = (props: IGetVendor) => {
  const vendorsList = () => {
    const vendorItem =
      props.vendors &&
      props.vendors
        .filter((e) => e.showInTerminal === 1)
        .map(({ vendorId, vendorName, locationVerified }) => (
          <Button
            variant="outlined"
            fullWidth={true}
            style={{ marginBottom: "3px" }}
            key={vendorId}
            onClick={() => {
              props.cbGetVendor(vendorId, locationVerified);
            }}
          >
            {vendorName}
          </Button>
        ));
    return <div> {vendorItem}</div>;
  };
  return (
    <Dialog open={true} maxWidth={"xs"}>
      <DialogTitle>Источник Заказа!</DialogTitle>
      <DialogContent>
        <DialogContentText>{vendorsList()}</DialogContentText>
        <Button
          fullWidth={true}
          variant="outlined"
          style={{ height: "100%" }}
          onClick={() => {
            props.cbGetVendor(null, false);
          }}
        >
          {" "}
          Выход{" "}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

interface ImapState {
  init: {
    vendors: {
      showInTerminal: number;
      vendorId: number;
      vendorName: string;
      locationVerified: boolean;
    }[];
  };
}

const mapState = (state: ImapState) => {
  return {
    vendors: state.init.vendors,
  };
};
const connector = connect(mapState);
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(GetVendor)