Tuyệt vời\! Việc chuyển sang tài liệu tiếng Anh sẽ làm cho hồ sơ của bạn chuyên nghiệp và dễ dàng chia sẻ hơn, đặc biệt khi làm việc trong môi trường công ty.

Dưới đây là nội dung chi tiết cho file `README.md` **bằng tiếng Anh**, bao gồm đầy đủ các phần: **Setup, Deployment, và Authentication Flow** theo yêu cầu của dự án.

Bạn có thể copy nội dung này vào file `README.md` trong repository của mình.

-----

### Mẫu Documentation (README.md) - English

````markdown
# MindX Onboarding - Week 1: Azure Fullstack Application

This project is a Fullstack Web Application (ReactJS + Node.js) containerized and deployed on the Azure Kubernetes Service (AKS) infrastructure, integrating Single Sign-On (SSO) authentication using OpenID Connect with the MindX Identity system.

## 🏗 Architecture Overview

The system is designed following a Microservices model on a Kubernetes platform:

* **Frontend**: ReactJS (TypeScript), containerized as a Static Content Server.
* **Backend**: Node.js Express API, containerized.
* **Database**: MongoDB Atlas.
* **Infrastructure**:
    * **Azure Container Registry (ACR)**: Centralized repository for Docker Images.
    * **Azure Kubernetes Service (AKS)**: Orchestration and management of all services.
    * **Ingress Controller (Nginx)**: Manages external routing and SSL termination.
* **Authentication**: OpenID Connect (OIDC) via the MindX ID Server (`https://id-dev.mindx.edu.vn`).

## 🚀 Setup & Local Development Guide

### 1. Prerequisites
Ensure you have the following installed:
* Node.js v18+
* Docker Desktop
* Azure CLI (`az`)
* Kubernetes CLI (`kubectl`)

### 2. Environment Variables Configuration

**Crucial Step**: Create a `.env` file in the **`backend/`** directory.

```env
PORT=3000
MONGO_URI=<Your_MongoDB_Connection_String>
JWT_SECRET=super_secret_key_123
JWT_EXPIRES_IN=1h

# --- MINDX SSO CONFIG ---
OAUTH_ISSUER_URL=[https://id-dev.mindx.edu.vn](https://id-dev.mindx.edu.vn)
OAUTH_AUTH_URL=[https://id-dev.mindx.edu.vn/auth](https://id-dev.mindx.edu.vn/auth)
OAUTH_TOKEN_URL=[https://id-dev.mindx.edu.vn/token](https://id-dev.mindx.edu.vn/token)
OAUTH_USERINFO_URL=[https://id-dev.mindx.edu.vn/me](https://id-dev.mindx.edu.vn/me)

OAUTH_CLIENT_ID=mindx-onboarding
OAUTH_CLIENT_SECRET=<Provided_Client_Secret>

# NOTE: Use localhost for local development. Use the Azure domain for deployment.
OAUTH_CALLBACK_URL=http://localhost:3000/auth/callback
````

### 3\. Running the Application Locally

Navigate to the root directory and run the services:

```bash
# 1. Install dependencies for both services
npm install # or cd into each folder and run npm install

# 2. Run Backend (Terminal 1)
cd backend
npm start

# 3. Run Frontend (Terminal 2)
cd frontend
npm start
```

Access the application via your local frontend URL (usually `http://localhost:3000`).

-----

## ☁️ Deployment Flow to Azure Kubernetes Service (AKS)

The deployment follows a progressive flow utilizing ACR and AKS for container orchestration.

### Step 1: Build and Push Docker Images

Log in to your Azure Container Registry (ACR) and push the containerized services:

```bash
# Login to Azure
az login
az acr login --name <your_acr_name>

# Build and Push Backend
docker build -t <your_acr_name>.azurecr.io/backend-app:v1 ./backend
docker push <your_acr_name>.azurecr.io/backend-app:v1

# Build and Push Frontend
docker build -t <your_acr_name>.azurecr.io/frontend-app:v1 ./frontend
docker push <your_acr_name>.azurecr.io/frontend-app:v1
```

### Step 2: Configure Kubernetes Manifests

Ensure your Kubernetes deployment YAML files (located in the `k8s/` folder) correctly configure the environment variables for the production domain.

**Crucial Configuration:** The `OAUTH_CALLBACK_URL` must match the URL whitelisted by the MindX Admin.

```yaml
# Snippet from api-deployment.yaml
      containers:
        - name: api-server
          image: <your_acr_name>.azurecr.io/backend-app:v1
          env:
            # All other Env Vars...
            - name: OAUTH_CALLBACK_URL
              value: "[https://haimindx-app-djamcah4c6b0fyb3.z03.azurefd.net/callback](https://haimindx-app-djamcah4c6b0fyb3.z03.azurefd.net/callback)"
```

### Step 3: Apply Deployment to AKS

Apply the deployment and service configurations to the AKS cluster:

```bash
# Get AKS credentials and configure kubectl access
az aks get-credentials --resource-group <resource_group_name> --name <aks_cluster_name>

# Apply the manifests
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/ingress.yaml
```

**Access URL:** `https://haimindx-app-djamcah4c6b0fyb3.z03.azurefd.net/` (or your custom domain if Step 6 is completed).

-----

## 🔐 Authentication Flow (OpenID Connect SSO)

The application uses the standard **Authorization Code Flow** for secure user login.

1.  **Initiation**: User clicks "Login via MindX" on the Frontend.
2.  **Authorization Request**: The Frontend redirects the user to the MindX Authorization Endpoint (`/auth`) with `client_id` and the `redirect_uri`.
3.  **Authentication**: The user logs in on the MindX Identity Server.
4.  **Code Grant**: MindX redirects the user back to the configured `OAUTH_CALLBACK_URL` with a short-lived `code`.
5.  **Token Exchange (Server-to-Server)**:
      * The Backend receives the `code`.
      * The Backend sends a POST request to the MindX Token Endpoint (`/token`), providing the `code`, `client_id`, and `client_secret`.
      * MindX validates the request and returns `access_token` and user claims.
6.  **Authorization & Session**: The Backend validates the claims, creates a local JWT (App Token), and returns it to the Frontend for session management and making authorized API calls.

-----

## ✅ Acceptance Criteria Status

The following Acceptance Criteria from the project overview have been addressed:

  * [x] The back-end API is deployed and accessible via a public HTTPS endpoint.
  * [x] The front-end React web app is deployed and accessible via a public HTTPS domain.
  * [ ] HTTPS is enforced for all endpoints (front-end and back-end). *(Achieved if Step 6 is complete)*
  * [x] Authentication is integrated and functional using OpenID with `https://id-dev.mindx.edu.vn`.
  * [x] Users can log in and log out via the front-end using OpenID.
  * [x] After login, authenticated users can access protected routes/pages on the front-end.
  * [x] The back-end API validates and authorizes requests using the OpenID token.
  * [x] All services are running on Azure Cloud infrastructure.
  * [x] Documentation is provided for setup, deployment, and authentication flow.

<!-- end list -->

```
```