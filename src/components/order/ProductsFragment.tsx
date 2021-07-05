import React, {useState} from "react";
import {StyledTableCell, StyledTableRow, StyledMenu} from '../styledComponents/stilesComponents';
import {connect, ConnectedProps} from 'react-redux'
import {DT} from "../../redux/dispatchTypes";
import {MenuItem, Button, Table, TableBody, TableContainer, TableHead, TableRow} from "@material-ui/core";
import {ArrowUpward, ArrowDownward, KeyboardReturn, DeleteOutline} from "@material-ui/icons";


interface IProductsFragment extends PropsFromRedux {
}

const ProductsFragment = (props: IProductsFragment) => {
    const [editProductProductKey, setEditProductProductKey] = useState("");
    const [anchorEdit, setAnchorEdit] = useState<HTMLInputElement>();
    const clickProduct = (productKey: string, productName: string, quantity: number, e: React.MouseEvent<HTMLTableRowElement>) => {
        setEditProductProductKey(productKey)
        setAnchorEdit(e.target as HTMLInputElement);
    }
    const endEdit = () => {
        setAnchorEdit(undefined)
        setEditProductProductKey("")
    }
    const removeProduct = () => {
        let product = Object.assign([], props.order.products.filter(({productKey}) => productKey !== editProductProductKey));
        props.orderSetContent({modified: true})
        props.orderSetContent({products: product})
        endEdit();
    }
    const changeQuantity = (op: string) => {
        let product = props.order.products.filter(({productKey}) => productKey === editProductProductKey)[0]; // мутирую стор
        if (op === "up") {
            product.quantity++
        }
        if (op === "down" && product.quantity > 1) {
            product.quantity--
        }
        product.total = product.price * product.quantity
        props.orderSetContent({modified: true})
    }

    const optionList = (optionList: []) => {
        if (Object.keys(optionList).length === 0) return
        let li = optionList.filter(({required}) => required === 0).map(({optionValueId, optionValueName, optionName}) =>
            <li style={{fontSize: '0.7rem'}} key={optionValueId}>{optionName}-{optionValueName}</li>)
        return (<ul> {li} </ul>
        )
    }
    const optionListRequired = (optionList: []) => {
        if (Object.keys(optionList).length === 0) return
        let options = optionList.filter(({required}) => required === 1).map(({optionValueId, optionValueName}) =>
            <span key={optionValueId}> - {optionValueName} </span>)
        return (options
        )
    }


    const productItem = props.order.products.map((opt) => {
            return (
                <StyledTableRow key={opt.productKey}
                                onClick={(e) => clickProduct(opt.productKey, opt.productName, opt.quantity, e)}>
                    <StyledTableCell>{opt.productName} {optionListRequired(opt.optionList)} {optionList(opt.optionList)} </StyledTableCell>
                    <StyledTableCell>{opt.quantity}</StyledTableCell>
                    <StyledTableCell>{opt.price}</StyledTableCell>
                    <StyledTableCell>{opt.total}</StyledTableCell>
                    <StyledTableCell>&nbsp;</StyledTableCell>
                    <StyledTableCell>{opt.total}</StyledTableCell>
                </StyledTableRow>)
        }
    )
    const tableHeaders = ['Наименование', 'Кол.', 'Цена', 'Сумма', 'Скидка', 'Итого'];
    return (
        <>
            <TableContainer>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            {tableHeaders.map((item: string, index) => <StyledTableCell key={index}
                                                                                        align="left">{item}</StyledTableCell>)}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {productItem}
                    </TableBody>
                </Table>
            </TableContainer>
            <StyledMenu
                keepMounted
                anchorEl={anchorEdit}
                open={Boolean(anchorEdit)}
                onClose={() => endEdit()}
            >
                <MenuItem>
                    <Button variant="outlined" style={{margin: '1px'}} onClick={() => removeProduct()}><DeleteOutline/>
                    </Button>
                    <Button variant="outlined" style={{margin: '1px'}}
                            onClick={() => changeQuantity("up")}><ArrowUpward/></Button>
                    <Button variant="outlined" style={{margin: '1px'}}
                            onClick={() => changeQuantity("down")}><ArrowDownward/></Button>
                    <Button variant="outlined" style={{margin: '1px'}}
                            onClick={() => endEdit()}><KeyboardReturn/></Button>
                </MenuItem>
            </StyledMenu>

        </>
    )
}

interface ImapState {
    config: object
    appState: object
    order: {
        orderData: {
            products: {
                productKey: string
                productName: string
                quantity: number
                total: number
                price: number
                optionList: []
            }[]
        }
    }
}

const mapState = (state: ImapState) => {
    return {
        config: state.config,
        appState: state.appState,
        order: state.order.orderData
    }
}
const mapDispatch = {orderSetContent: (content: object) => ({type: DT.orderSetContent, content: content})}

const connector = connect(mapState, mapDispatch)
type PropsFromRedux = ConnectedProps<typeof connector>
export default connector(ProductsFragment)