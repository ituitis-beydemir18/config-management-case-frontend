

   <template>
    <div class="home-container">
      <header>
        <img src="@/assets/logo.png" alt="Logo" class="logo" />
        <div class="user-menu" @click="toggleDropdown">
            <img src="@/assets/user-icon.png" alt="User Icon" />
            <span class="arrow-down"></span>
            <div v-if="showDropdown" class="dropdown-menu">
                <button @click="logout">Logout</button>
            </div>
        </div>
      </header>
      <div class="table-container" v-if="isDesktop">
        <table>
          <thead>
            <tr>
              <th>Parameter Key</th>
              <th>Value</th>
              <th>Description</th>
              <th>Create Date</th>

            </tr>
          </thead>
          <tbody>
            <tr v-for="param in parameters" :key="param.key">
              <td>{{ param.parameterKey }}</td>
              <td>{{ param.value }}</td>
              <td>{{ param.description }}</td>
              <td>{{ new Date(param.createDate).toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) }}</td>
              <td>
                <button @click="editParam(param)" class="edit-button">Edit</button>
                <button @click="deleteParam(param)" class="delete-button" >Delete</button>
              </td>
            </tr>
            <tr>
              <td><input v-model="newParam.key" placeholder="New Parameter" /></td>
              <td><input v-model="newParam.value" placeholder="Value" /></td>
              <td colspan="2"><input v-model="newParam.description" placeholder="New Description"  style="width: 100%;"/></td>
              <td><button @click="addParam" class="add-button">ADD</button></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="cards-container" v-else>
        <div class="card" v-for="param in parameters" :key="param.key">
          <p class="text-right"><strong>Parameter Key:</strong> {{ param.parameterKey }}</p>
          <p class="text-right"><strong>Value:</strong> {{ param.value }}</p>
          <p class="text-right"><strong>Description:</strong> {{ param.description }}</p>
          <p class="text-right"><strong>Create Date:</strong> {{ param.createDate }}</p>
          <div class="buttons-container">
            <button @click="editParam(param)" class="edit-button">Edit</button>
            <button @click="deleteParam(param)" class="delete-button">Del</button>
          </div>
        </div>
          <div class="card">
          <p><strong>Parameter Key:</strong> <input v-model="newParam.key" placeholder="New Parameter" /></p>
          <p><strong>Value:</strong> <input v-model="newParam.value" placeholder="Value" /></p>
          <p><strong>Description:</strong> <input v-model="newParam.description" placeholder="New Description" /></p>
          <button @click="addParam" class="add-button">ADD</button>
        </div>
      </div>
      <div v-if="showEditModal" class="modal">
        <div class="modal-content">
          <span class="close-button" @click="showEditModal = false">&times;</span>
          <h2>Edit Parameter</h2>
          <form @submit.prevent="updateParam"> 
            <div class="form-group">
              <label for="editKey">Parameter Key:</label>
              <input type="text" id="editKey" v-model="editParamData.parameterKey" readonly /> 
            </div>
            <div class="form-group">
              <label for="editValue">Value:</label>
              <input type="text" id="editValue" v-model="editParamData.value" />
            </div>
            <div class="form-group">
              <label for="editDescription">Description:</label>
              <textarea id="editDescription" v-model="editParamData.description"></textarea>
            </div>
            <button type="submit" class="add-button">Update</button>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { getAuth, signOut } from 'firebase/auth';
  import api from '@/services/api';
  export default {
    data() {
      return {
        parameters: [],
        isDesktop: window.innerWidth > 600,
        showDropdown: false,
        showEditModal: false,
        editParamData: {}, 
        newParam: {
          key: '',
          value: '',
          description: '',
        },
      };
    },
    created() {
      window.addEventListener('resize', this.checkWindowSize);
      this.fetchParameters();
    },
    beforeUnmount() {
      window.removeEventListener('resize', this.checkWindowSize);
    },
    methods: {
      formattedCreateDate(isoDate) {
        const date = new Date(isoDate);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');

        return `${day}/${month}/${year} ${hours}:${minutes}`;
      },
      editParam(param) {
        this.editParamData = { ...param }; // Create a copy to avoid modifying the original
        this.showEditModal = true; // Open the modal
      },
      async updateParam() {
        try {
          const auth = getAuth();
          const response = await api.post('/', this.editParamData, {
            headers: {
              Authorization: `Bearer ${auth.currentUser.accessToken}`,
            },
          });
          console.log('Parameter updated successfully:', response.data);

          // Update the parameter in the local array
          const index = this.parameters.findIndex(p => p.parameterKey === this.editParamData.parameterKey);
          if (index > -1) {
            this.parameters.splice(index, 1, this.editParamData); 
          }

          this.showEditModal = false; // Close the modal after successful update
        } catch (error) {
          console.error('Error updating parameter:', error);
          // Handle errors appropriately (display an error message, etc.)
        }
      },
      async fetchParameters() {
        try {
          const auth = getAuth();
          const response = await api.get('/', {
            headers: {
              Authorization: `Bearer ${auth.currentUser.accessToken}`,
            },
          });
          this.parameters = response.data.parameters;
        } catch (error) {
          console.error('Error fetching parameters:', error);
        }
      },
      async addParam() {
        const newParam = {
          parameterKey: this.newParam.key,
          value: this.newParam.value,
          description: this.newParam.description,
          createDate: new Date().toISOString(), // Use ISO 8601 format
        };

        try {
          const auth = getAuth();
          const response = await api.post('/', newParam, {
            headers: {
              Authorization: `Bearer ${auth.currentUser.accessToken}`,
            },
          });
          console.log('Parameter added successfully:', response.data); // Or handle response as needed
          this.parameters.push(newParam); // Update local list after successful add

          // Clear the input fields
          this.newParam.key = '';
          this.newParam.value = '';
          this.newParam.description = '';
        } catch (error) {
          console.error('Error adding parameter:', error);
          // Handle errors (show user message, etc.)
        }
      },
      async deleteParam(param) {
        try {
          const auth = getAuth();

          console.log('token:', auth.currentUser.accessToken);
          const response = await api.delete(`?parameterKey=${param.parameterKey}` , { 
            headers: {
              Authorization: `Bearer ${auth.currentUser.accessToken}`,
            },
          }); // Corrected the path variable usage
          console.log('Parameter deleted successfully:', response.data);
          this.parameters = this.parameters.filter((p) => p.parameterKey !== param.parameterKey); 
        } catch (error) {
          if (error.response && error.response.status === 401) {
            console.error('Unauthorized. Please check your authentication token.');
            // Consider redirecting to the login page or refreshing the token
          } else {
            console.error('Error deleting parameter:', error);
          }
        }
      },
      checkWindowSize() {
        this.isDesktop = window.innerWidth > 600;
      },
      toggleDropdown() {
        this.showDropdown = !this.showDropdown;
      },
      async logout() {
        const auth = getAuth();
        try {
          await signOut(auth);
          this.$router.push('/');
        } catch (error) {
          console.error('Logout failed:', error);
        }
      },
    },
  };
  </script>
  
  <style scoped>

.modal {
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
  background-color: #201c2c;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 30%;
  min-width: 300px;
}

.close-button {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close-button:hover,
.close-button:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #444; /* Daha koyu sınır */
  background-color: #1c1c3c; /* Karanlık arka plan rengi */
  color: white; /* Beyaz yazı rengi */
  box-sizing: border-box;
}
  .home-container {
    padding: 20px;
    color: white;
    background-color: #201c2c; /* Arka plan rengini ayarla */
    height: 100vh;
    display: flex;
    flex-direction: column;

  }
  
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 50px;
  }
  
  .logo {
    width: 50px;
    margin-left: 30px;
  }
  
 
  
  .user-menu {
  position: relative;
  cursor: pointer;
}

.user-menu img {
  width: 30px;
}

.arrow-down {
  display: inline-block;
  width: 0;
  height: 0;
  margin-left: 5px;
  vertical-align: middle;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid white;
}

.dropdown-menu {
  position: absolute;
  top: 40px;
  right: 0;
  background-color: #1c1c3c;
  border-radius: 4px;
  padding: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.table-container input {
    margin-bottom: 10px;
    padding: 10px;
    border-radius: 4px;
    border: 1px solid #444; /* Daha koyu sınır */
    background-color: #1c1c3c; /* Karanlık arka plan rengi */
    color: white; /* Beyaz yazı rengi */
    font-size: 16px;
    outline: none;
    transition: border-color 0.3s;
}

.table-container input::placeholder {
    color: #bbb; /* Placeholder rengi */
}

.table-container input:focus {
    border-color: #3b82f6; /* Odaklandığında mavi sınır */
}

.table-container .add-button {
    padding: 10px;
    border-radius: 4px;
    border: none;
    background-color: #3b82f6; /* Mavi arka plan rengi */
    color: white;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.table-container .add-button:hover {
    background-color: #2563eb; /* Hover olduğunda koyu mavi arka plan rengi */
}

.dropdown-menu button {
  background-color: #ff5252;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.dropdown-menu button:hover {
  background-color: #ff1744;
}
  
  .table-container table {
    width: 100%;
    border-collapse: collapse;
    margin-left: 20px;
    
  }
  
  .table-container th, .table-container td {
    padding: 10px;
    border: 1px solid #201c2c;
    text-align: left;
    vertical-align: middle; /* Ensures vertical alignment */
    
  }
  
  .cards-container {
    display: flex;
    flex-direction: column;

    
  }
  
  .card {
    background-color: #201c2c;
    border: 1px solid #bbb;
    padding: 10px;
    border-radius: 8px;
    margin-bottom: 10px;

  }
  
  .card p {
    margin: 0;
  }
  
.buttons-container {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.buttons-container .edit-button,
.buttons-container .delete-button {
  margin: 0 5px;
}
  
  .card button {
    margin-top: 10px;
    padding: 5px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    background-color: #3b82f6;
    color: #bbb;
    transition: background-color 0.3s;
  }

  .card .delete-button {
  background-color: #ff5252;
}

.card .delete-button:hover {
  background-color: #ff1744;
}
  
  .card button:hover {
    background-color: #2563eb;
  }
  .table-container .edit-button {
  background-color: #3b82f6; /* Mavi renk */
  color: white;
  font-weight: bold;
  border-radius: 4px;
  margin-right: 10px;
  width: 50px;
  height: 25px;
}

.table-container .edit-button:hover {
  background-color: #2563eb; /* Koyu mavi renk */
}

.table-container .delete-button {
  background-color: #ff5252; /* Kırmızı renk */
  color: white;
  font-weight: bold;
  border-radius: 4px;
  width: 60px;
  height: 25px;
}

.table-container .delete-button:hover {
  background-color: #ff1744; /* Koyu kırmızı renk */
}

.table-container .add-button {
  background-color: #1abc9c; /* Yeşil renk */
  margin-bottom: 10px;
  color: white;
  font-weight: bold;
  border-radius: 4px;
  width: 60px;
  height: 32px;



}

.table-container .add-button:hover {
  background-color: #16a085; /* Koyu yeşil renk */
}

.text-right {
  text-align: left;
}

@media (max-width: 600px) {
  .card {
    width: 100%;
    box-sizing: border-box;
    text-align: left;
  }

  .card button {
    width: auto;
    margin-top: 5px;
  }

  .card input{
    border-radius: 4px;
    border: 1px solid #444; /* Daha koyu sınır */
    background-color: #1c1c3c; /* Karanlık arka plan rengi */
    color: white; /* Beyaz yazı rengi */
  }

  .cards-container {
    padding: 0;
    margin-top: 0;
  }

  .edit-button,
  .delete-button,
  .add-button {
    width: auto;
    margin: 5px 0;
  }

  .buttons-container {
    display: flex;
    justify-content: center;
    gap: 10px; /* Butonlar arasında mesafe */
  }

  .delete-button {
    width: auto;
    padding: 5px 10px;

  }
  
  .logo {
    width: 65px; /* Mobil görünümde logo boyutunu artır */
    margin-left: 0px; /* Logo ile arasındaki boşluğu azalt */
    margin-bottom: -10px; /* Logo ile arasındaki boşluğu azalt */
  }

  .user-menu img {
    width: 50px; /* Mobil görünümde user icon boyutunu artır */
    margin-bottom: -10px; /* Logo ile arasındaki boşluğu azalt */
  }
}
  </style>
  


  
  <!-- { key: 'min_version', value: '1.4.4', description: 'Minimum required version of the app', createDate: '10/05/2021 01:58' },
  { key: 'latest_version', value: '1.4.7', description: 'Latest version of the app', createDate: '10/05/2021 01:58' },
  { key: 'pricing_tier', value: 't6', description: 'Pricing tier of the user', createDate: '07/07/2021 11:13' },
  { key: 'scroll', value: '5', description: 'Index of Scroll Paywall for free users.', createDate: '25/08/2021 10:22' },
  { key: 'scroll_limit', value: '13', description: 'Index of Scroll Limit Paywall for free users.', createDate: '25/08/2021 10:23' }, -->
