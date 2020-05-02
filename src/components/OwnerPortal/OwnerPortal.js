import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import OwnerPortalMarket from './OwnerPortalMarket';
import DateTimePicker from 'react-datetime-picker';
import BN from 'bn.js';
import { FluxContext } from '../FluxProvider';
import {addMarket} from '../../utils/marketsUtils';
import Loader from '../Loader';

const OwnerPortalContainer = styled.div`
	padding-top: 250px;
	background-color: white;
`;
const ShowHideButton = styled.button`
	padding-top: 250px;
	position: absolute;
`;
const MarketCreator = {
	display: 'flex',
	flexDirection: 'column',
	padding: '2px',
};

const OwnerPortal = ({markets = []}) => {
	const [{flux}, dispatch] = useContext(FluxContext);
	const [isOwner, setIsOwner] = useState(false);
	const [description, setDescription] = useState('new market');
	const [categories, setCategories] = useState();
	const [extraInfo, setExtraInfo] = useState('');
	const [outcomes, setOutcomes] = useState(2);
	const [endTime, setEndtime] = useState(new Date(new Date().setDate(new Date().getDate() + 1)));
	const [show, toggleShow] = useState(false);
	const [outcomeTags, setOutcomeTags] = useState([]);
	const outcomeInputs = [];
	const [loads, setLoads] = useState(false);
	const [showsMarkets, setShowsMarkets] = useState(false);

	const getIsOwner = async () => {
    if (!flux.walletConnection.isSignedIn()) return false;
	return true;
	}
	
	const setOutcomeTag = (value, i) => {
		const updatedTags = outcomeTags;
		updatedTags[i] = value;
		if (!updatedTags[i]) {
			alert(`Input ${i} is changed incorrectly!`);
			return;
		}
		setOutcomeTags(updatedTags);
	}

	if (outcomes > 2) {
		for (let i = 0; i < outcomes; i++) {
			outcomeInputs.push(
				<div key={i}>
				<label htmlFor={`outcome${i}`}>{`Outcome ${i + 1}: `}</label>
				<input id={`outcome${i}`} type="text" value={outcomeTags[i]} onChange={e => setOutcomeTag(e.target.value, i)}/>
				</div>
			)
		}
	} 

  useEffect(() => {
    getIsOwner().then(res => setIsOwner(res));
  }, []);


  const showMarketAdmin = () => {
	setShowsMarkets(!showsMarkets);
  };
  const ChangeOutcomes = (e) => {
	  let { value } = e.target;
	  setOutcomes(value);
  }
	const createMarket = async (e) => {
		if (outcomes < 2) { 
			alert('Number of outcomes must be greater then 1');
			return;
		}
		console.log("creating market...");
		setLoads(true);
		e.preventDefault();
		const categoryArray = categories && categories.length > 0 ? categories.split(",") : [];
		try {
		const signedMessage = await flux.account.connection.signer.signMessage("market_creation", flux.getAccountId(), "default")
		const txRes = await flux.createMarket(description, extraInfo, parseInt(outcomes), outcomeTags, ["test"], endTime.getTime(), 0);
		const marketId = parseInt(atob(txRes.status.SuccessValue));
		const { success } =  await addMarket(marketId, description, flux.getAccountId(), categoryArray, signedMessage);
		if (success) return; 
		throw new Error("Market wasn't successfully added to server");
		}
		catch(e) {
			alert('Something went wrong. Look into the console!');
			console.error(e);
			console.log(outcomeTags);
		}
	}
	const ownerPortalMarkets = 	markets.map((market, key) => <OwnerPortalMarket key={key} market={market}/>);
	return (
		isOwner ?
		<>
			{loads && <Loader />}
			<ShowHideButton onClick={e => toggleShow(!show)}>{show ? "-" : "+"}</ShowHideButton>
			{show && <OwnerPortalContainer>
				<label>New market:</label>
				<form style={MarketCreator}  onSubmit={ (e) => createMarket(e) }>
					<label htmlFor='desc'>Name:</label>
					<input
						id='desc'
						type="text"
						value={description}
						onChange={event => setDescription(event.target.value)} 
					/>
					<label htmlFor='categories'>Categories:</label>
					<input
						id='categories'
						type="text"
						value={categories}
						placeholder="categories"
						onChange={event => setCategories(event.target.value)} 
					/>
					<label htmlFor='extraInfo'>Extra Info:</label>
					<input
						type="text"
						value={extraInfo}
						placeholder="extra info"
						onChange={event => setExtraInfo(event.target.value)} 
					/>
					<label htmlFor='outcomes'> Number of outcomes:</label>
					<input
					   	id = 'outcomes'
						type="text"
						value={outcomes}
						onChange={ChangeOutcomes}
					/>

					{outcomeInputs}

					<label>end time:</label>
					<DateTimePicker
						value={endTime}
						onChange={setEndtime} 
					/>
					<button type="submit">Create Market</button>
				</form>
				<button onClick={showMarketAdmin}>{showsMarkets? 'Hide Markets' : 'Show Markets'} </button>
				{ showsMarkets && ownerPortalMarkets }
				
			</OwnerPortalContainer>}
		</>
		:
		<div></div>
	);
};

export default OwnerPortal;