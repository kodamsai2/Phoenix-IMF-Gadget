# Phoenix: IMF Gadget API

### Problem Statement: [Link](https://docs.google.com/document/d/18Gh_9mFr1vUH-o7Jvuu4gC_zU3f9cMjJ/edit?usp=sharing&ouid=101447500351170008204&rtpof=true&sd=true)


## Technologies Used

- **Backend:** Node.js, Express  
- **Database:** Neon (Serverless PostgreSQL), Sequelize ORM  
- **Authentication:** JSON Web Token (JWT), bcryptjs  
- **Security:** Helmet, CORS, Compression 
- **Deployment:** Render

## Getting Started
### Prerequisites
- Node.js
- npm

### Installation
1. Clone the repository:
    ```bash
    git clone https://github.com/kodamsai2/Phoenix-IMF-Gadget.git
    ```
2. Navigate to the project directory:
    ```bash
    cd Phoenix-IMF-Gadget
    ```
3. Install dependencies:
    ```bash
    npm install
    ```
### Environment Variables

Create a `.env` file in the root directory and add the following variables:  

```plaintext
PORT= 3000
DATABASE_URL= your_database_url_here
RANDOM_WORD_GENERATOR_URL=https://random-word.kodamsai2.workers.dev/ 
JWT_SECRET= IMF_SECRET
```

### Running the API
To start the API server at port: 3000, run:
```bash
npm run start
```

## Usage
### User Endpoints
- **POST /api/v1/signup**: User to signup using name and password in req.body

- **POST /api/v1/signin**: User to signin using name and password in req.body

### Gadget Endpoints
all routes require 'X-Authorization' header with value of jwtToken

- **GET /api/v1/gadgets/?status=**: Retrieve all gadgets data based on query parameter(status), if empty to get all gadgets

- **POST /api/v1/gadgets/**: Create new gadget with random name

- **PATCH /api/v1/gadgets/:id**: Update existing gadget's information(name and status) by UUID

- **DELETE /api/v1/gadgets/:id**: Delete existing gadget by UUID

- **POST /api/v1/gadgets/:id/self-destruct**: Trigger the self-destruct sequence for a specific gadget by UUID


### Links
Postman Documentation URL: https://documenter.getpostman.com/view/28166640/2sAYXEEyLs

ServerHost URL: https://phoenix-imf-gadget.onrender.com (Since I'm using the Render free tier, it takes some time to receive a response to the initial request.)

Docket Image URL: https://hub.docker.com/r/kodamsai2/imf-gadget-api


### To Run API server using Docker
#### Prerequisites
- Docker

To start the API server at port: 3000, run:
```bash
docker pull kodamsai2/imf-gadget-api
docker run -p 3000:3000 kodamsai2/imf-gadget-api:latest
```
