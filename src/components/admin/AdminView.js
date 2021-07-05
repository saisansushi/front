// import {connect} from "react-redux";
// import {Btn, DivCol, Footer, Header, Main, Wrapper} from '../styledComponents/stilesComponents';
// import {Modal} from "react-bootstrap";
// import {DT} from "../../redux/dispatchTypes";
//
// // панель администратора
// const AdminView = props => {
//     return (
//         <Wrapper>
//             <Header>
//             </Header>
//             <Main>
//                 <Modal
//                     show
//                     size="sm"
//                     backdrop="static"
//                     keyboard={false}
//                     centered
//                 >
//
//                     <Modal.Body>
//
//                         <DivCol>
//                             <Btn variant="light" block>Отчеты</Btn>
//
//                             <Btn variant="light" block>Отчеты на кассе</Btn>
//
//                             <Btn variant="light" block>Открытие смены</Btn>
//
//                             <Btn variant="light" block>Закрытие смены</Btn>
//
//                             <Btn variant="light" block onClick={() => {
//                                 props.logoutTerminal()
//                             }}>Отвязать терминал </Btn>
//
//                             <Btn variant="light" block onClick={() => {
//                                 props.changePage("main")
//                             }}>Назад</Btn>
//                         </DivCol>
//
//                     </Modal.Body>
//                 </Modal>
//             </Main>
//             <Footer>
//             </Footer>
//         </Wrapper>
//     )
// }
//
// export default connect(null,
//     dispatch => ({
//         changePage: (pageName) => {
//             dispatch({type: DT.setPage, pageName: pageName});
//         },
//         logoutTerminal: () => {
//             dispatch({type: DT.setTerminal, terminalId: 0});
//         }
//     })
// )(AdminView);