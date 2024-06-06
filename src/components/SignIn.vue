

   <template class="general-container">
    <div >
        <div class="login-container">
        <div class="login-box">
            <img src="@/assets/logo.png" alt="Logo" class="logo" />
            <h1>Please sign in</h1>
            <form @submit.prevent="signIn">
                <div class="input-container">
                    <input v-model="email" type="email" placeholder="E-mail address" />
                    <input v-model="password" type="password" placeholder="Password" />
                </div>
                <div class="input-container">
                    <button type="submit">Sign in</button>
                </div>
            </form>
        </div>
        <footer>
            <p>Codeway © 2021</p>
        </footer>
        </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
  import { useRouter } from 'vue-router';
  
  export default {
    setup() {
      const email = ref('');
      const password = ref('');
      const auth = getAuth();
      const router = useRouter();
  
      const signIn = async () => {
        try {
          await signInWithEmailAndPassword(auth, email.value, password.value);
          router.push('/home');
          alert('Signed in successfully!');

        } catch (error) {
          alert(error.message);
        }
      };
  
      return { email, password, signIn };
    },
  };
  </script>
  
  <style scoped>
  h1 {
    color: #31314d; /* Renk olarak istediğiniz değeri buraya yazabilirsiniz */

}

  .login-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh; 
    background-color: #201c2c;
    color: #fff;
    
  }
  
  .login-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px;
    border-radius: 8px;
    text-align: center;
    margin-top: -170px;
    width: 100%; /* Adjust this value as needed */
    max-width: 400px; /* Set a maximum width */
  }
  
  .login-box h1 {
    margin-bottom: 20px;
    font-size: 24px;
    color: #323153;
    font-family: 'Poppins', sans-serif;
  }
  
  .login-box form {
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;
  }
  .input-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    border: 0.5px solid #686b74;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 10px;
    font-family: 'Poppins', sans-serif;
}
  .input-container input {
    padding: 10px;
    border: none;
    background-color: transparent;
    color: #686b74;
    font-size: 16px;
    outline: none;
    transition: border-color 0.3s;
    font-family: 'Poppins', sans-serif;
}
.input-container input:focus {
  border-color: #ff69b4; /* Pembe çerçeve */
}
.input-container input:first-child {
  border-bottom: 0.5px solid #686b74;
}

  .login-box input:focus {
    border-color: #ff69b4; /* Pembe çerçeve */
  }
  
  .login-box input::placeholder {
    color: #686b74;
  }
  
  .login-box button {
    padding: 10px;
    border-radius: 4px;
    border: none;
    background: linear-gradient(to right, #4657b1, #5f78ee);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    color: white;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    font-family: 'Poppins', sans-serif;
  }
  
  .login-box button:hover {
    background: linear-gradient(to right, #3A52C1, #6879D9);
  }
  
  footer {
    margin-top: 20px;
    color: #686b74;
    font-family: 'Poppins', sans-serif;
  }
  
  .logo {
    width: 250px;
    margin-bottom: 50px;

  }
  
  @media (max-width: 600px) {
    .login-box {
      width: 90%;
      padding: 20px;
    }
  
    .login-box h1 {
      font-size: 20px;
    }
  
    .login-box input, .login-box button {
      font-size: 14px;
      padding: 8px;
    }

    .logo {
    width: 120px; /* Küçük ekranlarda logoyu küçültme */
    }
  }
  
  @media (min-width: 601px) and (max-width: 1024px) {
    .login-box {
      width: 80%;
      padding: 30px;
    }
  
    .login-box h1 {
      font-size: 22px;
    }
  
    .login-box input, .login-box button {
      font-size: 15px;
      padding: 9px;
    }
    
    .logo {
        width: 150px; /* Orta ekranlarda logoyu küçültme */
    }
  }
  </style>
  