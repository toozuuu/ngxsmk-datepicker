# Contributing to ngxsmk-datepicker

Welcome! We are thrilled that you're interested in contributing to `ngxsmk-datepicker`, the zero-dependency Angular date picker. Whether you're reporting a bug, suggesting a feature, or writing code, your efforts are highly valued.

Please take a moment to review this document to make the contribution process as smooth as possible.

## 🤝 Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please ensure you treat all community members with respect and professionalism.

## 🐛 Reporting Bugs and Issues

If you find a bug, please first check the existing [Issues on GitHub](https://github.com/toozuuu/ngxsmk-datepicker/issues) to see if it has already been reported.

If it's a new bug:

1.  **Use the appropriate template** for bug reports.
    
2.  **Describe the bug clearly and concisely.**
    
3.  **Provide reproduction steps:** Detail the sequence of actions needed to reproduce the issue (e.g., _Click X_, _Set Input Y to Z_).
    
4.  **Include your environment details:** Angular version, TypeScript version, Browser/OS.
    
5.  **Include screenshots or GIFs** if the bug is visual (highly encouraged).
    

## ✨ Suggesting Enhancements

We welcome suggestions for new features or improvements to existing functionality.

1.  **Use the appropriate template** for feature requests.
    
2.  **Describe the need:** Explain why the new feature would be useful, what problem it solves, and how it aligns with the project's goal (zero-dependency, standalone component).
    
3.  **Keep it focused:** If possible, propose a solution or API interface for the new feature.
    

## 💻 Local Development Setup

`ngxsmk-datepicker` is an Angular workspace (monorepo) containing the library and a demo application.

### Prerequisites

-   Node.js (LTS version recommended)
    
-   npm (or yarn/pnpm)
    
-   Angular CLI (globally installed)
    

### Setup Steps

1.  **Fork** the repository to your own GitHub account.
    
2.  **Clone** your fork locally:
    
        git clone [https://github.com/YOUR_USERNAME/ngxsmk-datepicker.git](https://github.com/YOUR_USERNAME/ngxsmk-datepicker.git)
        cd ngxsmk-datepicker
        
    
3.  **Install dependencies:**
    
        npm install
        
    
4.  **Run the Demo Application:** To test your changes while developing, serve the demo app:
    
        # Ensure you target the demo-app project
        ng serve demo-app 
        
    
    (The demo application typically runs at `http://localhost:4200`.)
    

## 🖊️ Submitting Changes (Pull Requests)

Please follow these steps to contribute code:

1.  **Create a New Branch:** Base your branch off of `main`.
    
        git checkout -b feat/add-new-feature
        
    
2.  **Make Your Changes:** Implement your bug fix or feature. Remember to keep the code clean and well-documented (using JSDoc for public methods/properties).
    
3.  **Test Your Changes:** Run tests and verify the changes in the demo application.
    
        ng test ngxsmk-datepicker
        
    
4.  **Write Clear Commit Messages:** We adhere to the [**Conventional Commits specification**](https://www.conventionalcommits.org/en/v1.0.0/). This helps us automate versioning and changelog generation.
    
    -   **Format:** `type(scope): subject`
        
    -   **Examples:**
        
        -   `feat(time): Add 12-hour AM/PM time selection toggle`
            
        -   `fix(css): Resolve z-index issue on time dropdown panel`
            
        -   `refactor(core): Refactor multi-month rendering loop`
            
5.  **Push Your Branch:**
    
        git push origin feat/add-new-feature
        
    
6.  **Open a Pull Request (PR):** Navigate to your fork on GitHub and submit a PR to the `main` branch of the original repository.
    
    -   Ensure your PR title follows the Conventional Commits format (e.g., `feat(time): Implement AM/PM toggle`).
        
    -   Reference any related issues (e.g., `Closes #123`).
        

We will review your PR as quickly as possible and provide feedback. Thank you again for your contribution!
