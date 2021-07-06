import {connect, ConnectedProps} from "react-redux";
import {Wrapper, Main, Header, Footer} from '../styledComponents/stilesComponents';
import {Button} from "@material-ui/core";
import   {DT} from '../../redux/dispatchTypes'

interface IMainView extends  PropsFromRedux {

}
const   MainView = (props:IMainView) => {


        return (
            <Wrapper>
                <Header>
                </Header>
                <Main logo >
                </Main>
                <Footer spaceAround >
                                <Button  variant="outlined"   onClick={() => {
                                  //  props.changePage("admin")
                                }}>Режим администратора
                                </Button>
                                <Button variant="outlined"   onClick={() => {
                                    props.changePage("list")
                                }}>Журнал заказов
                                </Button>
                </Footer>
            </Wrapper>
        )
}



const mapDispatch=    {
    changePage: (pageName:string) => ({type: DT.setPage, pageName: pageName})
}
const connector = connect(null, mapDispatch)
type PropsFromRedux = ConnectedProps<typeof connector>
export default connector(MainView)
