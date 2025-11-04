import React from 'react';
import './Button.css';

// We pass `children` for the text and an `isPrimary` prop to change styles
const Button = ({ children, isPrimary = true, onClick }) => {
  const buttonClass = isPrimary ? 'button primary' : 'button secondary';

  return (
    <button className={buttonClass} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;