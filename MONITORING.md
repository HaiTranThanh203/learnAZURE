# 📊 Monitoring & Observability Documentation

This document provides instructions on how to access, interpret, and troubleshoot both **Production Metrics** (System Health) and **Product Metrics** (User Behavior) for the MindX Web App.

---

## 1. Production Metrics (Azure Monitor)
**Purpose:** Monitors infrastructure health, server performance, and critical errors.

### 📍 Access Instructions
1. Log in to the [Azure Portal](https://portal.azure.com).
2. Navigate to the **Application Insights** resource named `mindx-app-insights`.
3. Use the left-hand menu to access:
   - **Live Metrics:** For real-time system status (CPU, RAM, Request Rate).
   - **Alerts:** For reviewing fired alerts and notification history.

### 📈 Interpreting Key Metrics
| Metric | Description | Threshold / Alert Condition |
| :--- | :--- | :--- |
| **Failed Requests** | The count of requests returning 4xx or 5xx error codes. | **Alert Trigger:** `Failed Requests > 0` (Immediate Email Notification). |
| **Server Response Time** | Time taken for the server to process a request. | High latency (>2s) indicates potential server overload. |
| **Availability** | The percentage of time the application is accessible. | Target: 99.9% uptime. |

---

## 2. Product Metrics (Google Analytics 4)
**Purpose:** Tracks user behavior, engagement, and feature usage on the Frontend.

### 📍 Access Instructions
1. Log in to the [Google Analytics Dashboard](https://analytics.google.com).
2. Select the Property: **MindX Web App**.
3. Navigate to **Reports** -> **Realtime**.

### 📈 Interpreting Key Metrics
* **Users (User Sessions):** The number of active users on the site within the last 30 minutes.
* **Views (Page Views):** Total number of pages viewed. Helps identify popular routes (e.g., `/todos`, `/products`).
* **Event Count:** Tracks specific user interactions.

### 🎯 Custom Events Tracking
We monitor specific user actions to understand feature adoption:

| Event Name | Category | Label | Meaning |
| :--- | :--- | :--- | :--- |
| `Click_Login_SSO` | `User_Auth` | `Button_MindX_Login` | Tracks when a user clicks the "Login with MindX (SSO)" button. Indicates user intent to authenticate. |

---

## 3. Configuration & Integration Details

### Frontend Integration
- **Library:** `react-ga4`
- **Implementation:**
  - Initialization occurs in `src/App.tsx` via `useEffect`.
  - Page views are tracked automatically on route changes.
  - Custom events are triggered via the `logEvent` utility in `src/analytics.ts`.

### Environment Variables
- **Measurement ID:** 
- **Variable Name:** 

### Alerts Configuration
- **Action Group:** Emails are sent to the administrator when critical thresholds are breached.
- **Rule:** "Failed Requests > 0" (Static Threshold).