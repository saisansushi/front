import { connect, ConnectedProps } from "react-redux";
import { DT } from "../../redux/dispatchTypes";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from "@material-ui/core";
import React from "react";

// авторизация терминала

interface ILoginTerminal extends PropsFromRedux {}

const loginTerminal = (props: ILoginTerminal) => {
  const clickBtnRegister = () => {
    // тут какая то  авторизация
    // если всё ок то приходит id терминала
    props.loginTerm(1);
  };

  return (
    <Dialog open={true} maxWidth={"xs"}>
      <DialogTitle> </DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField fullWidth variant="outlined" label="Логин" />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              variant="outlined"
              type="password"
              label="Пароль"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => {
            clickBtnRegister();
          }}
        >
          Зарегать
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const mapState = (state: { navigation: { pageName: string } }) => ({
  age: state.navigation.pageName,
});

const mapDispatch = {
  loginTerm: (terminalId: number) => ({
    type: DT.setTerminal,
    terminalId: terminalId,
  }),
};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(loginTerminal)