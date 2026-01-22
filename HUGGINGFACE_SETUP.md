# How to Set Up Hugging Face for Deployment

To enable your app to generate code without crashing your server, you need a **Hugging Face Access Token**.

## Step 1: Get Your Token
1.  **Go to Hugging Face**: Visit [huggingface.co](https://huggingface.co/) and log in (or sign up if you don't have an account).
2.  **Open Settings**: Click on your profile picture in the top right corner and select **Settings**.
3.  **Access Tokens**: On the left sidebar, click **Access Tokens**.
4.  **Create New Token**:
    *   Click the **Create new token** button.
    *   **Name**: Give it a name like `render-deployment`.
    *   **Type**: Select **Read** (this is sufficient for generating code).
    *   Click **Create token**.
5.  **Copy the Token**: You will see a string starting with `hf_...`. Copy this immediately.

## Step 2: Add to Render
Now you need to give this token to your backend hosted on Render.

1.  Go to your **Render Dashboard**.
2.  Click on your **Backend Service** (e.g., `codenudi-backend`).
3.  Click on **Environment** in the left sidebar.
4.  Click **Add Environment Variable**.
5.  Enter the following:
    *   **Key**: `HF_TOKEN`
    *   **Value**: Paste your token here (e.g., `hf_12345...`)
6.  Click **Save Changes**.

## Step 3: Verify (Optional)
If you also want to use a specific custom model you trained instead of the default `Salesforce/codet5-base`, you can add another variable:
*   **Key**: `HF_REPO_ID`
*   **Value**: `your-username/your-model-name`

Render will automatically restart your server. Once it's back up, the AI code generation will work smoothly via the cloud API!
