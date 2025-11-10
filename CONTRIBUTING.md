# 🤝 Contributing to J.A.R.V.I.S. MARK VII

First off, thank you for considering contributing to J.A.R.V.I.S.! It's people like you that make it such a great tool.

## 🌟 Ways to Contribute

### 1. Star the Repository
The easiest way to support the project! ⭐

### 2. Report Bugs
Found a bug? [Create an issue](https://github.com/Soyelijah/jarvis-mark-vii/issues/new)

Include:
- OS and Node version
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

### 3. Suggest Features
Have an idea? [Open a feature request](https://github.com/Soyelijah/jarvis-mark-vii/issues/new)

### 4. Submit Pull Requests
Code contributions are welcome!

#### PR Guidelines:
- Fork the repo
- Create a feature branch (`git checkout -b feature/amazing-feature`)
- Write clear, commented code
- Add tests if applicable
- Update documentation
- Commit with descriptive messages
- Push to your fork
- Open a PR

## 🧪 Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/jarvis-mark-vii.git
cd jarvis-mark-vii

# Install dependencies
npm install
cd web-interface/backend && npm install
cd ../frontend && npm install

# Start development
# Terminal 1: Backend
cd web-interface/backend
node server.cjs

# Terminal 2: Frontend
cd web-interface/frontend
npm run dev

# Terminal 3: Tests
npm test
```

## ✅ Code Style

- Use ES6+ features
- Follow existing code patterns
- Comment complex logic
- Keep functions small and focused
- Use meaningful variable names

## 🧪 Testing

- Backend: `cd web-interface/backend && npx jest`
- Frontend: `cd web-interface/frontend && npm test`
- All tests must pass before PR

## 📝 Commit Messages

Use semantic commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Formatting
- `refactor:` Code restructuring
- `test:` Adding tests
- `chore:` Maintenance

Example: `feat: add voice command support`

## 🏆 Recognition

Contributors will be:
- Listed in README
- Mentioned in release notes
- Invited to contributor Slack

## 💼 Enterprise Features

Some features are reserved for the Enterprise Edition. If you're interested in developing enterprise features commercially, contact us through the [Enterprise inquiry template](https://github.com/Soyelijah/jarvis-mark-vii/issues/new?template=enterprise.md).

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## ❓ Questions?

Feel free to reach out via [GitHub Discussions](https://github.com/Soyelijah/jarvis-mark-vii/discussions).

---

**"Every contribution, no matter how small, makes a difference. Thank you!"** ⚡
