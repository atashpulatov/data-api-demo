/* eslint-disable */
import React, {Component} from 'react';
// import {connect} from 'react-redux';
// import '../index.css';
// import '../home/home.css';
// import {selectorProperties} from '../attribute-selector/selector-properties';
// import {AttributeSelector} from '../attribute-selector/attribute-selector.jsx';
// //import { PromptEditorContainer } from './modules/prompt/PromptEditorContainer/PromptEditorContainer'
// import {PopupButtons} from '../popup-buttons.jsx';
// import 'mstr-react-library/src/css/mstr-react.css';
/* eslint-enable */
export const PromptsWindow = () => <div />;
// export class PromptsWindow extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       session: {
//         USE_PROXY: false,
//         url: this.props.parsed.envUrl,
//         authToken: this.props.parsed.token,
//         projectId: this.props.parsed.projectId,
//       },
//       reportId: this.props.parsed.reportId,
//       triggerUpdate: false,
//       loading: true,
//       currentPageKey: '',
//       dossierInstanceId: '',
//       docId: '',
//       // The one below is not needed, but can be useful if we need to ensure the sessionId and authToken match
//       sessionId: '',
//     };
//     this.container = React.createRef();
//     this.outerCont = React.createRef();
//   }
//     loadEmbeddedDossier = () => {
//       const {authToken, projectId} = this.state.session;
//       const container = this.container.current;
//       const url = `https://localhost:8443/consume-dev/app/${projectId}/${this.state.reportId}`;
//       debugger;
//       console.log(this.state.session);
//       const CustomAuthenticationType = microstrategy.dossier.CustomAuthenticationType;
//       microstrategy.dossier.create({
//         url: url,
//         enableCustomAuthentication: true,
//         customAuthenticationType: CustomAuthenticationType.AUTH_TOKEN,
//         enableResponsive: true,
//         // Following function is our default implementation, user could provide his/her own implementation
//         getLoginToken: function() {
//           return Promise.resolve(authToken);
//         },
//         placeholder: container,
//       }).then((dossierPageState) => {
//         // TODO: Check if there is a better api call for the currentPageKey
//         const currentPageKey = dossierPageState.children[0].getCurrentPage().nodeKey;

//         const docId = dossierPageState.getDocId();
//         const dossierInstanceId = dossierPageState.getDossierInstanceId();
//         this.setState({
//           loading: false,
//           currentPageKey,
//           dossierInstanceId,
//           docId,
//         });
//       });
//     }
//     handleOk = () => {
//       this.setState({triggerUpdate: true, loading: true});
//       const okObject = {
//         command: selectorProperties.commandOk,
//         // body,
//         instanceId: this.state.dossierInstanceId,
//         objectId: this.state.reportId,
//         docId: this.state.docId,
//         currentPageKey: this.state.currentPageKey,
//       };
//       Office.context.ui.messageParent(JSON.stringify(okObject));
//     }
//     handleCancel = () => {
//       const cancelObject = {
//         command: selectorProperties.commandCancel,
//       };
//       Office.context.ui.messageParent(JSON.stringify(cancelObject));
//     }
//     onTriggerUpdate = (body) => {
//       const updateObject = {
//         command: selectorProperties.commandOnUpdate,
//         body,
//       };
//       Office.context.ui.messageParent(JSON.stringify(updateObject));
//     };
//     componentDidMount() {
//       this.loadEmbeddedDossier();
//     }
//     /**
//      * resets triggerUpdate property to false in order to allow re-pressing OK button
//      * should be called every time OK is pressed but selector popup should not close
//      */
//     resetTriggerUpdate = () => {
//       this.setState({triggerUpdate: false, loading: false});
//     };
//     render() {
//       return (
//         <div
//           style={{position: 'relative'}}
//           ref={this.outerCont}
//         >
//           <div ref={this.container} className="awesome"></div>
//           <div style={{position: 'absolute', bottom: '0'}}>
//             <PopupButtons
//               handleOk={this.handleOk}
//               handleCancel={this.handleCancel}
//               loading={this.state.loading} />
//           </div>
//         </div>
//       );
//     }
// }
