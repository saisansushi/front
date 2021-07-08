import React, { useState } from "react";
import {
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@material-ui/core";
import { KeyboardReturn, PersonOutline } from "@material-ui/icons";

interface IGetName {
  cbGetName: (name: string | null) => void; // возвращаем нал в случае если нажата кнопка отмена
}

const GetName = (props: IGetName) => {
  const [name, setName] = useState("");

  const keyPressInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      clickOkButton();
    }
  };
  const clickExitButton = () => {
    props.cbGetName(null);
  };

  const clickOkButton = () => {
    name.length > 1 && props.cbGetName(name);
  };

  const changeInputName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const clickNoNameButton = () => {
    let name = "Не представился";
    setName(name);
    props.cbGetName(name);
  };
  return (
    <Dialog open={true} maxWidth={"xs"}>
      <DialogTitle>Вопрос клиенту!</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <div>
            <p>Как я могу к вам обращаться?</p>
            <ButtonGroup style={{ width: "100%" }}>
              <TextField
                label="Имя"
                autoFocus={true}
                value={name}
                onChange={changeInputName}
                onKeyPress={keyPressInput}
              />
              <Button variant="outlined" onClick={() => clickNoNameButton()}>
                <PersonOutline />
              </Button>
            </ButtonGroup>
          </div>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={() => clickExitButton()}>
          <KeyboardReturn />
        </Button>

        <Button variant="outlined" onClick={() => clickOkButton()}>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GetName