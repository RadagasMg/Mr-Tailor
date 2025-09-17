# Resume Tailor AI

**Resume Tailor AI** is a powerful, locally-run web application designed to help job seekers effortlessly customize their resumes and cover letters for specific job applications. By leveraging the power of OpenAI's GPT models, this tool analyzes your master CV and a job description to generate perfectly tailored application documents, giving you a competitive edge in your job search.

This application runs entirely in your browser, ensuring your sensitive data and API keys remain private and secure.

---

## ✨ Features

*   **🔒 Secure & Private:** Your OpenAI API key and personal data are stored locally in your browser's local storage and are never sent to any server except directly to OpenAI.
*   **🤖 AI-Powered Tailoring:** Utilizes `gpt-4o-mini` to intelligently adapt your resume and generate compelling cover letters based on a specific job description.
*   **📄 Master CV Management:** Upload, edit, and manage a "master" version of your CV.
*   **🧠 AI-Enhancements:**
    *   **Validate & Format:** Automatically format your raw CV text into a clean, professional Markdown structure.
    *   **AI Enhance:** Improve the phrasing, impact, and clarity of your CV with a single click.
*   **💡 Job Suggestions:** Get relevant job title and company suggestions based on your master CV.
*   **📊 Comprehensive Results:**
    *   **Tailored Resume:** A version of your CV optimized for the target job.
    *   **Custom Cover Letter:** A persuasive cover letter written in your chosen style.
    *   **Company Insights:** A brief, AI-generated overview of the company.
    *   **Actionable Observations:** Get immediate feedback on how your CV matches the job description.
*   **🎛️ Customizable AI:** Fine-tune the "embellishment level" of the AI to control how much it "creatively" enhances your experience.
*   **📂 Application History:** Keep track of all the applications you've generated.
*   **👤 Personalized Profiles:** Customize the AI's output by setting your name, gender, language, and preferred document style (Professional, Creative, etc.).
*   **🎨 Modern UI:** A sleek, responsive, and user-friendly interface with both dark and light modes.
*   **💾 Easy Data Management:** Export your generated documents as Markdown files and clear your application history at any time.

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

You need to have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) (or a similar package manager) installed on your machine.

### Installation

1.  **Get an OpenAI API Key**
    You will need an API key from [OpenAI](https://platform.openai.com/account/api-keys) to use the AI features of this application.

2.  **Clone the repository**
    ```sh
    git clone https://github.com/your-username/resume-tailor-app.git
    cd resume-tailor-app
    ```

3.  **Install NPM packages**
    ```sh
    npm install
    ```

4.  **Run the application**
    ```sh
    npm run dev
    ```
    This will start the development server. Open your browser and navigate to the URL provided (usually `http://localhost:5173/`).

---

##  usage Usage

The first time you launch the application, you will be greeted with a simple setup process.

### 1. Initial Setup

*   **Language & Profile:** Choose your preferred language, screen name, gender, and the default style for your documents. This information helps the AI generate more personalized content.
*   **API Key:** After the initial setup, navigate to the **Settings** tab and enter your OpenAI API key. This is a crucial step for all AI functionalities to work.

### 2. Upload Your Master CV

*   Go to the **Master CV** tab.
*   You can either **upload a `.txt` or `.md` file** or **paste your resume content** directly into the text area.
*   Use the **Validate & Format** button to structure your CV cleanly, or the **AI Enhance** button to improve its content.

### 3. Tailor Your Application

*   Navigate to the **Tailor & Results** tab.
*   Paste the **job description** for the position you're applying for into the appropriate text area.
*   Adjust the **Embellishment Level** slider to control the creativity of the AI.
*   Click the **Tailor Documents** button.

### 4. Review the Results

*   The AI will generate a tailored resume, cover letter, and company insights. You can switch between them using the tabs in the results panel.
*   **Copy** the content to your clipboard or **Download** it as a `.md` file.
*   Your application will be automatically saved in the **History** tab.

### 5. Manage History and Settings

*   **History:** View a list of all past applications. You can clear the history at any time.
*   **Settings:** Update your profile information or your OpenAI API key.

---

## 🛠️ Built With

*   [React](https://reactjs.org/)
*   [Tailwind CSS](https://tailwindcss.com/)
*   [Lucide React](https://lucide.dev/) (for icons)
*   [OpenAI API](https://openai.com/docs)

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request
