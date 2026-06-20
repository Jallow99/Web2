## Clone The Project:

### Run the following commands on gitbash
```bash
cd backend
touch .env
npm install
cd ..
cd frontend
ng compile
npm install
```

## Now, navigate to the backend of the application and into the .env file

put the following keys there:

```bash
MONGO_URI=link-to-your-mongodb-atlas
JWT_SECRET=your-secret-key

# Port for the backend server
PORT=5000

```

Make sure to replace the placeholder values with your actual values.