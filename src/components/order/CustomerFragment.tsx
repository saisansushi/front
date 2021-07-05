import React, {useState} from "react";
import {connect, ConnectedProps} from 'react-redux'
import styled from "styled-components";
import {DT} from "../../redux/dispatchTypes";
import {Edit} from "@material-ui/icons";
import {ButtonGroup, Grid, Typography} from "@material-ui/core";
import {Button,} from "@material-ui/core";

const DivCell = styled.div`
       border: 1px solid rgba(0, 0, 0, 0.23);   
       padding: 10px;
       white-space:nowrap;
       overflow:auto;    
       text-overflow: clip`;
const Textarea = styled.textarea`
       width: 100%;
       border: 1px solid rgba(0, 0, 0, 0.23);   
       resize:none;
       :focus {
               background-color: transparent;
               outline: none;
               }
       border-top-right-radius: 5px;
       border-bottom-right-radius: 5px;`;
const BlockSelectAddress = styled.div`
       background-color:white;
       position:absolute;
       width: 100%`;

interface ICustomerFragment extends PropsFromRedux {
}

const CustomerFragment = (props: ICustomerFragment) => {



    const handleChangeComment = (event: React.ChangeEvent<HTMLTextAreaElement>) => {

        props.orderSetContent ({comment : event.target.value, modified: true})
    }




    const [viewSelectAddress, setViewSelectAddress] = useState(false);


    const addressRepresent = () => {
        switch (props.order.shippingMethod) {
            case 'delivery':
                if (props.order.addresses.some(({addressId}) => addressId === props.order.addressId)) {
                    return props.order.addresses.filter(({addressId}) => addressId === props.order.addressId)[0].addressRepresent;
                }
                break;
            case  'pickup':
                return "Самовывоз"
            default:
                return "Выбери адрес"
        }
    }


    const addressSelected = (addressId: number, shippingMethod: string) => {
        props.orderSetContent({shippingMethod: shippingMethod, addressId: addressId, modified: true})
        setViewSelectAddress(false);
    }

    const clientAddressesItem = props.order.addresses.map(({addressId, addressRepresent}) =>
        <DivCell key={addressId} style={{width: '100%'}}
                 onClick={() => addressSelected(addressId, 'delivery')}>
            <Typography variant="body2">{addressRepresent}</Typography>
        </DivCell>
    )

    const clientAddresses = viewSelectAddress && <Grid container>
        <DivCell style={{backgroundColor: 'GhostWhite', width: '100%', textAlign:'center'}}
                 onClick={() => addressSelected(0, 'pickup')}>
            <Typography variant="body1">Самовывоз</Typography>
        </DivCell>
        {clientAddressesItem}
        <DivCell style={{backgroundColor: 'GhostWhite', width: '100%', textAlign:'center'}}
                 onClick={() => {setViewSelectAddress(false);props.changeAddressMode('new')}}>
            <Typography variant="body1">Добавить новый</Typography>
        </DivCell>
    </Grid>


    return (
        <Grid>
            <Grid container direction="row">
                <ButtonGroup style={{width: '100%'}}>
                    <DivCell style={{width: '80%'}}>
                        <Typography variant="body1">{props.order.customer.firstname} </Typography>
                    </DivCell>
                    <Button variant="outlined" style={{width: '10%'}}>i</Button>
                    <Button variant="outlined" style={{width: '10%'}}>i</Button>
                </ButtonGroup>
            </Grid>

            <Grid container direction="row">
                <ButtonGroup style={{width: '100%'}}>
                    <DivCell style={{width: '80%'}}>
                        <Typography variant="body1">{props.order.customer.telephone} </Typography>
                    </DivCell>
                    <Button variant="outlined" style={{width: '10%'}}>i</Button>
                    <Button variant="outlined" style={{width: '10%'}}>i</Button>
                </ButtonGroup>
            </Grid>
            <Grid container direction="row">
                <ButtonGroup style={{width: '100%'}}>
                    <DivCell style={{width: '90%'}}
                             onBlur={() => {setTimeout(() => setViewSelectAddress(!viewSelectAddress), 200)}}
                             onClick={() => setViewSelectAddress(!viewSelectAddress)}>
                        <Typography variant="body2">{addressRepresent()}</Typography>
                    </DivCell>
                    <Button style={{width: '10%'}} variant="outlined"
                            onClick={() => {if (props.order.shippingMethod !== 'pickup') {props.changeAddressMode('edit')}}}>
                        <Edit/>
                    </Button>
                </ButtonGroup>
            </Grid>

            <div style={{position: 'relative'}}><BlockSelectAddress>{clientAddresses} </BlockSelectAddress></div>

            <Grid container direction="row">
                <Textarea rows={3} value={props.order.comment ? props.order.comment : ''} onChange={handleChangeComment}/>
            </Grid>
        </Grid>
    )

}

interface ImapState {
    order: {
        orderData: {
            customer: {
                firstname: string
                telephone: string
            }
            comment: string
            shippingMethod: string
            addresses: {
                addressId: number
                addressRepresent: boolean
            }[]
            addressId: number
        }
    }
}

interface IOrderSetContent {
    comment?: string
    shippingMethod?: string
    addressId?: number
    modified?: boolean
}

const mapState = (state: ImapState) => ({
    order: state.order.orderData
})

const mapDispatch = {
    orderSetContent: (content: IOrderSetContent) => ({type: DT.orderSetContent, content: content}),
    changeAddressMode: (mode: string) => ({type: DT.setAddressMode, addressMode: mode})
}
const connector = connect(mapState, mapDispatch)
type PropsFromRedux = ConnectedProps<typeof connector>
export default connector(CustomerFragment)