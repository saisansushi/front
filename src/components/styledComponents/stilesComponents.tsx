import styled from 'styled-components';
import { Menu, MenuProps, TableCell, TableRow} from "@material-ui/core";
import {createStyles, Theme, withStyles} from '@material-ui/core/styles';
import preloaderImg from "../../images/preloader.gif";
import logo from "../../images/logo.jpg";
import React from "react";


export const Preloader = styled.img.attrs({
    src: preloaderImg,
    alt: "preloader"
})`
    position: absolute;
    top:50%;
    left:50%;
    transform:translate(-50%, -50%);
    width: 100px;
    height: 100px;
    z-index:1200;
`;


export const StyledTableCell = withStyles((theme: Theme) =>
    createStyles({
        head: {
            backgroundColor: theme.palette.common.white,
            color: theme.palette.common.black,
        },
    }),
)(TableCell);

export const StyledTableRow = withStyles((theme: Theme) =>
    createStyles({
        root: {
            '&:nth-of-type(odd)': {
                backgroundColor: theme.palette.action.hover,
            },
        },
    }),
)(TableRow);

export const StyledMenu = withStyles({
    paper: {
        border: '1px solid #d3d4d5',
    },
})((props: MenuProps) => (<Menu elevation={0}
                                getContentAnchorEl={null}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'center',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'center',
                                }}
                                {...props}
    />
));




export const Wrapper = styled.div`
   width: 100%;
   height: 100%;
    display: flex;
    flex-direction: column; 
    justify-content: space-between;
    
`;



export const Main = styled.main<{ row?: boolean; logo?: boolean; }>` 
    height: 100%;
     overflow: auto;
    display: flex;   
    justify-content: flex-start;   
    ${props => props.row && ` flex-direction: row;` || ` flex-direction: column;`}
    ${props => props.logo && ` background: url("${logo}") 100% 50%  no-repeat;
    background-size: contain`}
       `;


export const Header = styled.header`
`;

export const Footer = styled.footer<{ spaceAround?: boolean; }>`
    display: flex;
    flex-direction: row;    
    padding: 10px;
    ${props => props.spaceAround && ` justify-content: space-around` || ` justify-content: flex-end;`}
`;



export const DivCol = styled.div`
   width: 100%;
    display: flex;
    flex-direction: column; 
    justify-content: space-between;    
`;


