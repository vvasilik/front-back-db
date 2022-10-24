import { useEffect, useState, useRef } from 'react';
import { isEqual } from 'lodash';
import { v4 } from 'uuid';
import './App.css';

export const serverUrl = process.env.NODE_ENV === 'development'
	? 'http://localhost:3001/'
	: `/`;

function App() {
	const [messages, setMessages] = useState([]);
	const [storedMessages, setStoredMessages] = useState([]);
	const [newMessage, setNewMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const inputRef = useRef(null);

	const getStoredMessages = async () => {
		setIsLoading(true);
		try {
			const response = await fetch(`${serverUrl}message`);
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

	const removeMessage = (idToBeRemoved) => {
		setMessages(messages.filter(({ id }) => id !== idToBeRemoved));
	};

	const storeMessages = async () => {
		setIsLoading(true);
		try {
			const response = await fetch(`${serverUrl}message`, {
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
		if (event.key === 'Enter' && newMessage !== '') {
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

	useEffect(() => {
		if (!isLoading && inputRef.current) {
			inputRef.current.focus();
		}
	}, [isLoading]);

	return (
		<div className="App">
			<div className='input-area'>
				<span className='input-area-title'>Message:</span>
				<input
					className='input-area-input'
					ref={inputRef}
					onChange={(event) => setNewMessage(event.target.value)}
					onKeyDown={keyDownHandler}
					type="text"
					disabled={isLoading}
					value={newMessage}
				/>
				<button
					className='input-area-button'
					disabled={newMessage === '' || isLoading}
					onClick={addMessage}>
						Save
					</button>
			</div>
			<div className='messages-area'>
				<ul className='list'>
					{messages.sort((a, b) => a.timestamp < b.timestamp).map(({id, timestamp, message}, index) =>
						<li className='list-row' key={id}>
							<span className='list-index'>{index + 1}.</span>
							<span className='list-item-message'>{message}</span>
							<span className='list-item-date'>{new Date(timestamp).toLocaleString()}</span>
							<button
								disabled={isLoading}
								className='list-item-remove'
								onClick={() => removeMessage(id)}
							>✗</button>
						</li>
					)}
					{messages.length === 0 && !isLoading && <li className='list-row'>No messages</li>}
					{messages.length === 0 && isLoading && <li className='list-row'>Loading...</li>}
					{messages.length > 0 && isLoading && <li className='list-row'>
						<span className='list-index'/>
						<span className='list-item-message'>Saving...</span>
					</li>}
				</ul>
			</div>
		</div>
	);
}

export default App;
