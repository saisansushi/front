import  {useEffect} from "react";
import axios from 'axios'
import {connect, ConnectedProps} from "react-redux";
import   {DT} from '../redux/dispatchTypes'
import {Preloader} from "./styledComponents/stilesComponents";

interface IInit extends PropsFromRedux{

}
const  Init = (props:IInit) => {
    useEffect(() => {
        axios.post(props.apiURL + "init/",
           {
           },{
                headers: {
                     'Content-Type': 'application/json',
                    'Token-Authorization-X': props.token
                }
            }
           )
            .then(response => {
                if (response.data.init) {
                    props.setInitProducts(response.data.init[0].products);
                    props.setInitVendors(response.data.init[0].vendors);
                    props.initCompleted(true);
                }else{
                    props.setNetworkError(true);
                }
            })
            .catch(error => {
                    console.log(error)
                    props.setNetworkError(true);
                }
            )
    }, []);
    return (
       <> <Preloader /></>
    )
}

interface ImapState{
    config:{
        apiURL:string
        token:string
    }
}

const mapState=(state: ImapState) => ({
    apiURL: state.config.apiURL,
    token: state.config.token
})

const mapDispatch={
    changePage: (pageName:string) => ({type: DT.setPage, pageName: pageName}),
    initCompleted: (Completed:boolean) => ({type: DT.initCompleted, initCompleted: Completed}),
    setInitVendors: (content:{}) => ({type: DT.setInitVendors, content: content}),
    setInitProducts: (content:{}) => ({type: DT.setInitProducts, content: content}),
    setNetworkError: (action:boolean) => ({type: DT.setNetworkError, networkError: action})
}
const connector = connect(mapState, mapDispatch)
type PropsFromRedux = ConnectedProps<typeof connector>
export default connector(Init)