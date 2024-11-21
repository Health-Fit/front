<template>
    <div class="signup-container">
      <h2>회원가입</h2>
      <form>
        <label for="id">아이디</label>
        <input type="text" name="id" id="id" placeholder="아이디 입력" />
        
        <label for="password">패스워드</label>
        <input type="password" name="password" id="password" placeholder="패스워드 입력" />
        
        <label for="email">이메일</label>
        <input type="email" name="email" id="email" placeholder="이메일 입력" />
        
        <button>회원가입</button>
      </form>
    </div>
  </template>
  
  <script setup>
  </script>
  
  <style scoped>
  .signup-container {
    max-width: 400px;
    margin: 50px auto;
    padding: 20px;
    background-color: #f0f8ff; /* Light sky blue */
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
    align-items: stretch;
    width: 100%; /* Ensure form takes full width of container */
  }
  
  label {
    font-size: 16px;
    color: #555;
    margin-top: 15px; /* Space above each label */
    text-align: left; /* Align labels to the left */
  }
  
  input[type="text"],
  input[type="password"],
  input[type="email"],
  button {
    width: 100%;
    padding: 10px;
    margin-top: 5px; /* Space between label and input */
    margin-bottom: 15px; /* Space below each input */
    font-size: 16px;
    border-radius: 4px;
    box-sizing: border-box;
  }
  
  input[type="text"],
  input[type="password"],
  input[type="email"] {
    border: 1px solid #87CEEB; /* Sky blue border */
    outline: none;
  }
  
  input[type="text"]:focus,
  input[type="password"]:focus,
  input[type="email"]:focus {
    border-color: #6baedb;
    box-shadow: 0px 0px 4px rgba(135, 206, 235, 0.5);
  }
  
  button {
    background-color: #87CEEB; /* Sky blue button */
    color: white;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  button:hover {
    background-color: #6baedb; /* Slightly darker blue on hover */
  }
  </style>
  