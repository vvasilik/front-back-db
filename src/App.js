import { useEffect, useState } from 'react';
import { isEqual } from 'lodash';
import { v4 } from 'uuid';
import './App.css';

function App() {
	const [messages, setMessages] = useState([]);
	const [storedMessages, setStoredMessages] = useState([]);
	const [newMessage, setNewMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const getStoredMessages = async () => {
		setIsLoading(true);
		try {
			const response = await fetch('http://localhost:3001/message');
			const { list } = await response.json();

			if (!list || list?.length === 0) {
				return;
			}
			setMessages(list);
			setStoredMessages(list);
		} catch (error) {
			console.log(`Get error: ${error.message}`);
		} finally {
			setIsLoading(false);
		}
	}

	const addMessage = () => {
		const newMessages = [
			...messages,
			{ id : v4(), message: newMessage, timestamp: Date.now() }
		];
		setMessages(newMessages);
		setNewMessage("");
	};

	const storeMessages = async () => {
		setIsLoading(true);
		console.log(messages)
		try {
			const response = await fetch('http://localhost:3001/message', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ list: messages })
			});
			const { list } = await response.json();
			setMessages(list);
		} catch (error) {
			console.log(`Set error: ${error.message}`);
		} finally {
			setStoredMessages(messages);
			setIsLoading(false);
		}
	}

	const keyDownHandler = (event) => {
		if (event.key === 'Enter') {
			addMessage();
		}
	};

	useEffect(() => {
		getStoredMessages();
	}, []);

	useEffect(() => {
		if (isEqual(messages, storedMessages)) {
			return;
		}
		storeMessages();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [messages]);

	return (
		<div className="App">
			<div className='input-area'>
				<span className='input-area-title'>Message:</span>
				<input
					onChange={(event) => setNewMessage(event.target.value)}
					onKeyDown={keyDownHandler}
					type="text"
					disabled={isLoading}
					value={newMessage}
				/>
				<button onClick={addMessage}>Save</button>
			</div>
				<ul className='list'>
					{messages.map(({id, timestamp, message}, index) =>
						<li className='list-row' key={id}>
							<span
								className='list-index'>
									{index + 1}.
							</span>
							<span>{message}</span>
							<small>({new Date(timestamp).toLocaleString()})</small>
						</li>
					)}
					{messages.length === 0 && <li className='list-row'>No messages</li>}
				</ul>
		</div>
	);
}

export default App;
