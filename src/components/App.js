import React, { useEffect, useContext, useState} from 'react';
import Header from './Header';
import Markets from './Markets/Markets';
import OwnerPortal from './OwnerPortal/OwnerPortal';
import OrderModal from './Markets/Market/OrderModal';
import Loader from './Loader';
import { FluxContext, connect } from './FluxProvider';
import { OrderProvider } from './OrderProvider';
import { API_URL } from '../constants';
//import socketIOClient from "socket.io-client";
//import { WebSocketContext } from './WSProvider';
import {getMarkets} from '../utils/marketsUtils';

//const ws = socketIOClient(API_URL);

function App({...props}) {
  const [{flux}, dispatch] = useContext(FluxContext);
  //const [socket, dispatchSocket] = useContext(WebSocketContext);
  const [markets, setMarkets] = useState([]);

  const specificId = props.match.params.marketId;
  
  useEffect(() => {
   // dispatchSocket({type: "webSocketConnected", payload: ws});
    connect().then( async fluxInstance => {
      dispatch({type: 'connected', payload: {flux: fluxInstance}});
      let marketIds = [];
      if (specificId) {
        marketIds = [parseInt(specificId)];
      } else {
        const res = await getMarkets([])
        marketIds = res.markets.length > 0 ? res.markets.map(market => parseInt(market.marketId)) : [];
      }
      fluxInstance.getMarketsById(marketIds).then(res => {
        setMarkets(fluxInstance.formatMarkets(res));
      })
    })
  }, [specificId]);



  return (
    flux ?
    <>
      <OwnerPortal markets={markets}/>
      <Header />
      <OrderProvider>
        <Markets specificId={specificId} markets={markets}/>
        <OrderModal />
      </OrderProvider>
    </>
    :
    <Loader txLoading={true}/>
  );
}



export default App;
