<template>
    <div class="login-container">
      <h2>Login</h2>
      <form>
        <input type="text" placeholder="ID 입력" />
        <input type="password" placeholder="PW 입력" />
        <button>로그인</button>
      </form>
    </div>
  </template>
  
  <script setup>
  </script>
  
  <style scoped>
  .login-container {
    max-width: 400px;
    margin: 50px auto;
    padding: 20px;
    background-color: #f0f8ff; /* Light sky blue background */
    border-radius: 8px;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
    text-align: center;
  }
  
  h2 {
    color: #333;
    font-size: 24px;
    margin-bottom: 20px;
  }
  
  form {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  input[type="text"],
  input[type="password"] {
    width: 80%;
    padding: 10px;
    margin: 10px 0;
    border: 1px solid #87CEEB; /* Sky blue border */
    border-radius: 4px;
    font-size: 16px;
  }
  
  button {
    width: 85%;
    padding: 12px;
    margin-top: 15px;
    background-color: #87CEEB; /* Sky blue button */
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 18px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  button:hover {
    background-color: #6baedb; /* Slightly darker blue on hover */
  }
  </style>
  