import React from 'react';
import './Loader.scss';

const Loader: React.FC = () => {
  return (
    <div className='loader'>
      <div className='loader__spinner'></div> Ładowanie...
    </div>
  );
};

export default Loader;
