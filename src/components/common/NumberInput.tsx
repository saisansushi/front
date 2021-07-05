import React,{useState,  useRef} from "react";
import {ArrowLeft,  KeyboardReturn  } from "@material-ui/icons";
import { Dialog, Button,
    DialogContent,
    DialogTitle,  TextField
} from "@material-ui/core";

/**
   numeric keyboard

   props
   cbNumberInput  - колбек
   maxLengthNumberInput - количество символов
   placeholder
   title
*/
interface INumberInput{
    maxLengthNumberInput:number
    title:string
    placeholder:string
    cbNumberInput: (number: string|null) => void
}

const  NumberInput = (props:INumberInput) => {

    const [number, setNumber] = useState("");
    const textInput = useRef<HTMLInputElement>(null);


    const clickNumButton = (e:string) => {
        number.length < props.maxLengthNumberInput && setNumber(number + e)
        if (textInput.current==null) return
        textInput.current.focus();
    }
    const clickBsButton = () => {
        number.length === 0 || setNumber(number.slice(0, -1))
        if (textInput.current==null) return
        textInput.current.focus();
    }
    const clickClearButton = () => {
        setNumber("");
        if (textInput.current==null) return
        textInput.current.focus();
    }
    const clickExitButton = () => {
        props.cbNumberInput(null)
    }
    const clickOkButton = () => {
        number.length === props.maxLengthNumberInput && props.cbNumberInput(number)
        if (textInput.current==null) return
        textInput.current.focus();
    }

    const keyPressInput = (e:React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            clickOkButton()
        }
    }

    const changeInput = (event : React.ChangeEvent<HTMLInputElement>) => {

        let value = event.target.value.replace(/[^\d]/g, '');
        value.length <= props.maxLengthNumberInput && setNumber(value)
    }
    return (


        <Dialog open={true} maxWidth={'lg'}>
            <DialogTitle>    {props.title}</DialogTitle>
            <DialogContent>
                <table>
                    <tr>
                        <td colSpan={4}>
                            <TextField placeholder={props.placeholder}  autoFocus fullWidth value={number} inputRef={textInput} onKeyPress={keyPressInput} onChange={changeInput}/>

                        </td>
                    </tr>
                    <tr>
                        <td><Button variant="outlined" fullWidth={true} onClick={() => clickNumButton('1')}>1</Button></td> 
                        <td><Button variant="outlined" fullWidth={true} onClick={() => clickNumButton('2')}>2</Button></td>
                        <td><Button variant="outlined" fullWidth={true} onClick={() => clickNumButton('3')}>3</Button></td>
                        <td><Button variant="outlined" fullWidth={true} onClick={() => clickBsButton()}><ArrowLeft/></Button></td>
                    </tr>
                    <tr>
                        <td><Button variant="outlined" fullWidth={true} onClick={() => clickNumButton('4')}>4</Button></td>
                        <td><Button variant="outlined" fullWidth={true} onClick={() => clickNumButton('5')}>5</Button></td>
                        <td><Button variant="outlined" fullWidth={true} onClick={() => clickNumButton('6')}>6</Button></td>
                        <td><Button variant="outlined" fullWidth={true} onClick={() => clickClearButton()}>C</Button></td>
                    </tr>
                    <tr>
                        <td><Button variant="outlined" fullWidth={true} onClick={() => clickNumButton('7')}>7</Button></td>
                        <td><Button variant="outlined" fullWidth={true} onClick={() => clickNumButton('8')}>8</Button></td>
                        <td><Button variant="outlined" fullWidth={true} onClick={() => clickNumButton('9')}>9</Button></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td><Button variant="outlined" fullWidth={true} onClick={() => clickExitButton()}><KeyboardReturn/></Button></td>
                        <td><Button variant="outlined" fullWidth={true} onClick={() => clickNumButton('0')}>0</Button></td>
                        <td></td>
                        <td><Button variant="outlined" fullWidth={true} onClick={() => clickOkButton()}>OK</Button></td>
                    </tr>
                </table>
            </DialogContent>
        </Dialog>


    )
}


export default NumberInput;