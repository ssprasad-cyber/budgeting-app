import React, { useState, useEffect } from 'react';
import ExpenseForm from './components/ExpenseForm';
import BudgetForm from './components/BudgetForm';
import ExpenseList from './components/ExpenseList';
import BudgetSummary from './components/BudgetSummary';
import SavingSuggestions from './components/SavingSuggestions';
import Analytics from './components/Analytics';
import Header from './components/Header';
import Footer from './components/Footer';
import './App.css';
import ExpenseQRScanner from './components/ExpenseQRScanner';
import LocalStorage from './localdata/LocalStorage';

function App() {
  const [budget, setBudget] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const [errorMessages, setErrorMessages] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [userData, setUserData] = useState(null);

  function handleBudgetSubmit(newBudget) {
    setBudget(newBudget);
  }

  function handleExpenseSubmit(newExpense) {
    setExpenses([...expenses, newExpense]);
  }

  // User Login info
  const database = [
    { username: 'user', password: 'pass' },
    { username: 'pavan', password: '1234' },
    { username: 'yaswanth', password: '1234' },
    { username: 'aditya', password: '1234' },
  ];

  const errors = {
    uname: 'invalid username',
    pass: 'invalid password',
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    var { uname, pass } = document.forms[0];
    const userData = database.find((user) => user.username === uname.value);

    if (userData) {
      if (userData.password !== pass.value) {
        setErrorMessages({ name: 'pass', message: errors.pass });
      } else {
        setIsSubmitted(true);
        setUserData(userData);
      }
    } else {
      setErrorMessages({ name: 'uname', message: errors.uname });
    }
  };

  const renderErrorMessage = (name) =>
    name === errorMessages.name && (
      <div className="error">{errorMessages.message}</div>
    );

  const renderForm = (
    <div className="forms">
      <h2>XPENSO</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-containers">
          <label className="log">Username </label>
          <input className="logger" type="text" name="uname" required />
          {renderErrorMessage('uname')}
        </div>
        <div className="input-containes">
          <label className="log">Password </label>
          <input className="logger" type="password" name="pass" required />
          {renderErrorMessage('pass')}
        </div>
        <p id="start">Forgot Password</p>
        <div className="button-containers">
          <input className="logger" type="submit" />
        </div>
      </form>
    </div>
  );

  useEffect(() => {
    if (isSubmitted && userData) {
      const userPastData = LocalStorage.get(userData.username);
      if (userPastData) {
        setBudget(userPastData.budget);
        setExpenses(userPastData.expenses);
      }
    }
  }, [isSubmitted, userData]);

  useEffect(() => {
    if (isSubmitted && userData) {
      LocalStorage.set(userData.username, { budget, expenses });
    }
  }, [budget, expenses, isSubmitted, userData]);

  const renderUserData = userData && (
    <div className="user-data">
      <h3>Past Data</h3>
      {/* Display user's past data here */}
    </div>
  );

  return (
    <div className="app">
      <div className="login-form">
        {isSubmitted ? (
          <div className="container">
            <Header />
            <ExpenseQRScanner />
            <div className="budget-section">
              <BudgetForm onSubmit={handleBudgetSubmit} />
              <BudgetSummary budget={budget} expenses={expenses} />
            </div>
            <div className="expense-section">
              <ExpenseForm onSubmit={handleExpenseSubmit} />
              <ExpenseList expenses={expenses} />
            </div>
            <div className="suggestions-section">
              <SavingSuggestions
                expenses={expenses}
                remainingBudget={budget - expenses.reduce((acc, cur) => acc + cur.amount, 0)}
              />
              <Analytics expenses={expenses} />
              <Footer />
            </div>
            {renderUserData}
          </div>
        ) : (
          renderForm
        )}
      </div>
    </div>
  );
}

export default App;
