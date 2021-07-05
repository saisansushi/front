import {
    Dialog, DialogActions, Button,
    DialogContent,
    DialogTitle
} from "@material-ui/core";
import React from "react";

/**
 модальная форма
 да / нет / ок

 props
 callback  - колбек
 typeButton - вид кнопок   ok / yes-no / mo-yes    // зеленая кнопка всегда справа
 footer - текст перед кнопками
 body
 title
 */
interface IQuestion {
    typeButton: string
    footer?: string
    title?: string
    body?: string
    callback: (resp: boolean) => void


}

const Question = (props: IQuestion) => {
    let footer = null

    switch (props.typeButton) {
        case 'ok':
            footer = <div>
                <Button color="primary" variant="outlined" onClick={() => {
                    props.callback(true)
                }}>OK
                </Button>
            </div>
            break;
        case 'yes-no':
            footer = <div>
                <div> {props.footer} </div>
                <Button color="secondary"  variant="outlined" style={{marginRight: '20px'}} onClick={() => {
                    props.callback(true)
                }}>Да

                </Button>
                <Button color="primary"  variant="outlined" onClick={() => {
                    props.callback(false)
                }}>Нет
                </Button>

            </div>
            break;
        case 'no-yes':
            footer = <div>
                <div> {props.footer} </div>
                <Button color="secondary"  variant="outlined" style={{marginRight: '20px'}} onClick={() => {
                    props.callback(false)
                }}>Нет
                </Button>
                <Button color="primary" variant="outlined"  onClick={() => {
                    props.callback(true)
                }}>Да
                </Button>

            </div>
            break;
    }


    return (
        <Dialog open={true} maxWidth={'sm'}>
            <DialogTitle>  {props.title}</DialogTitle>
            <DialogContent>
                {props.body}
            </DialogContent>
            <DialogActions>
                {footer}
            </DialogActions>
        </Dialog>


    );
}
export default Question;


