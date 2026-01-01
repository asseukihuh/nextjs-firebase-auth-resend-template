# Contributing to SaaS Template

First off, thanks for considering contributing to the SaaS Template! It's people like you that make this template such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* **Use a clear and descriptive title**
* **Describe the exact steps which reproduce the problem** in as many details as possible
* **Provide specific examples to demonstrate the steps**
* **Describe the behavior you observed after following the steps** and point out what exactly is the problem with that behavior
* **Explain which behavior you expected to see instead and why**
* **Include screenshots and animated GIFs** if possible
* **Include your environment details**: OS, Node.js version, pnpm version

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* **Use a clear and descriptive title**
* **Provide a step-by-step description of the suggested enhancement** in as many details as possible
* **Provide specific examples to demonstrate the steps**
* **Describe the current behavior** and **the expected behavior**
* **Explain why this enhancement would be useful**

### Pull Requests

* Fill in the required template
* Follow the TypeScript and code style guides
* End all files with a newline
* Include appropriate test cases
* Document new code

## Styleguides

### Git Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line

### TypeScript Styleguide

* Use TypeScript for all code
* Follow the existing code style
* Use meaningful variable names
* Add comments for complex logic
* Use proper error handling

### Documentation Styleguide

* Use Markdown
* Reference method names in backticks: `` `someMethod()` ``
* Reference classes in backticks: `` `SomeClass` ``

## Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/saas-template.git
   cd saas-template
   ```

2. **Install Dependencies**
   ```bash
   pnpm install
   ```

3. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Make Your Changes**
   - Keep commits atomic and well-documented
   - Add comments to complex logic
   - Update documentation as needed

5. **Test Your Changes**
   ```bash
   pnpm build
   pnpm lint
   ```

6. **Commit and Push**
   ```bash
   git add .
   git commit -m "Add your commit message"
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**
   - Provide a clear title and description
   - Reference any related issues
   - Include screenshots if UI changes
   - Request review from maintainers

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Authentication pages
│   ├── (dashboard)/     # Dashboard pages
│   ├── api/             # API routes
│   └── page.tsx         # Home page
├── components/          # React components
├── lib/                 # Utility functions
└── types/               # TypeScript types

README.md                # Main documentation
DEPLOYMENT.md           # Deployment guide
```

## Areas for Contribution

### High Priority

* [ ] End-to-end tests
* [ ] GitHub Actions CI/CD pipeline
* [ ] Additional authentication methods (Google, GitHub)
* [ ] Email template improvements
* [ ] Documentation improvements

### Medium Priority

* [ ] i18n (internationalization)
* [ ] Dark mode support
* [ ] Admin dashboard
* [ ] User roles and permissions
* [ ] Audit logging

### Low Priority

* [ ] UI component library
* [ ] Storybook integration
* [ ] Performance monitoring
* [ ] Analytics integration

## Testing

When adding new features:

1. Test locally with `pnpm dev`
2. Build for production with `pnpm build`
3. Test with real Firebase and Resend credentials in a test environment
4. Include screenshots/video of new features

## Documentation

When adding features:

1. Update [README.md](./README.md) if it affects setup or usage
2. Update [DEPLOYMENT.md](./DEPLOYMENT.md) if it affects deployment
3. Add inline code comments for complex logic
4. Update TypeScript types appropriately

## Release Process

Releases follow semantic versioning:

- `MAJOR`: Breaking changes
- `MINOR`: New features (backward compatible)
- `PATCH`: Bug fixes (backward compatible)

## Additional Notes

### Issue and Pull Request Labels

This project uses labels for organization:

* `bug` — Something isn't working
* `enhancement` — New feature or request
* `documentation` — Improvements or additions to documentation
* `help wanted` — Extra attention is needed
* `good first issue` — Good for newcomers
* `wontfix` — This will not be worked on
* `duplicate` — This issue or pull request already exists

## Community

* **Discussions**: GitHub Discussions for questions and ideas
* **Issues**: For bug reports and feature requests
* **Pull Requests**: For code contributions

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Questions?** Feel free to open an issue with the `question` label or start a discussion!

Thank you for your interest in making this template better!
