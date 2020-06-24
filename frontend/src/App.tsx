import React, { useState } from 'react';
import axios from 'axios';

import logo from './logo.svg';
import './App.css';
import { Url } from '../../api/src/models/url';

const API_URL = 'http://localhost:4000';

function App() {
  const [inputURL, setInputURL] = useState('');
  const [inputShort, setInputShort] = useState('');
  const [generatedURL, setGeneratedUrl] = useState('');

  //TODO: Sort out port and api hosting

  const onFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const requestBody = {
      url: inputURL,
      short: inputShort,
    };

    const response = await axios
      .post(`${API_URL}/api/url`, requestBody)
      .then((response) => response);

    const short = response.data.short;

    setGeneratedUrl(`${API_URL}/${short}`);
  };

  const handleUrlInputChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setInputURL(event.target.value);

  const handleShortInputChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setInputShort(event.target.value);

  return (
    <div className='App'>
      <h1>Simple URL Shortener</h1>

      <form onSubmit={onFormSubmit}>
        <div>
          <label htmlFor='url'>URL</label>
          <input id='url' onChange={handleUrlInputChange}></input>
          <label htmlFor='short'>Short</label>
          <input id='short' onChange={handleShortInputChange}></input>
        </div>
        <button type='submit'>Create URL</button>
      </form>

      <a href={generatedURL}>URL: {generatedURL}</a>
    </div>
  );
}

export default App;
